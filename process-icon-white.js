import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function colorDistanceSq(r1,g1,b1,r2,g2,b2){
  const dr=r1-r2, dg=g1-g2, db=b1-b2;
  return dr*dr+dg*dg+db*db;
}

async function processWhiteBG(){
  const inPath = path.join(__dirname, 'public/icon.png');
  const outPath = path.join(__dirname, 'public/icon.png');
  const image = await Jimp.read(inPath);

  const width = image.bitmap.width;
  const height = image.bitmap.height;
  // sample corners (10x10 or smaller)
  const sample = 8;
  const corners = [
    {x:0,y:0},
    {x:width-sample,y:0},
    {x:0,y:height-sample},
    {x:width-sample,y:height-sample}
  ];

  let br=0,bg=0,bb=0,bcnt=0;
  for(const c of corners){
    for(let dx=0; dx<sample; dx++){
      for(let dy=0; dy<sample; dy++){
        const x = Math.min(width-1, Math.max(0, c.x+dx));
        const y = Math.min(height-1, Math.max(0, c.y+dy));
        const idx = (y*width + x) * 4;
        const d = image.bitmap.data;
        br += d[idx];
        bg += d[idx+1];
        bb += d[idx+2];
        bcnt++;
      }
    }
  }
  const bgR = Math.round(br/bcnt);
  const bgG = Math.round(bg/bcnt);
  const bgB = Math.round(bb/bcnt);

  // tolerance squared
  const tol = 60; // tweakable
  const tolSq = tol*tol;

  // build close-to-bg boolean map
  const close = new Uint8Array(width*height);
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const idx=(y*width + x)*4;
      const r=image.bitmap.data[idx];
      const g=image.bitmap.data[idx+1];
      const b=image.bitmap.data[idx+2];
      const distSq = colorDistanceSq(r,g,b,bgR,bgG,bgB);
      if(distSq <= tolSq) close[y*width + x]=1;
    }
  }

  // flood fill from borders to identify background connected region
  const bgMask = new Uint8Array(width*height);
  const stack = [];
  // push border pixels that are close
  for(let x=0;x<width;x++){
    if(close[x]){ stack.push([x,0]); bgMask[0*width + x]=1; }
    const yi = (height-1)*width + x;
    if(close[yi]){ stack.push([x,height-1]); bgMask[yi]=1; }
  }
  for(let y=0;y<height;y++){
    if(close[y*width + 0]){ stack.push([0,y]); bgMask[y*width + 0]=1; }
    if(close[y*width + (width-1)]){ stack.push([width-1,y]); bgMask[y*width + (width-1)]=1; }
  }

  while(stack.length){
    const [x,y] = stack.pop();
    const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
    for(const [nx,ny] of neighbors){
      if(nx>=0 && nx<width && ny>=0 && ny<height){
        const i = ny*width + nx;
        if(!bgMask[i] && close[i]){
          bgMask[i]=1;
          stack.push([nx,ny]);
        }
      }
    }
  }

  // create numeric alpha mask (0 or 255) and smooth with small box blur
  const mask = new Float32Array(width*height);
  for(let i=0;i<width*height;i++) mask[i] = bgMask[i] ? 0 : 255;

  // apply two passes of 3x3 box blur to smooth edges (anti-alias)
  const blurPass = (src, dst) => {
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        let sum=0, cnt=0;
        for(let oy=-1; oy<=1; oy++){
          for(let ox=-1; ox<=1; ox++){
            const nx = x+ox, ny = y+oy;
            if(nx>=0 && nx<width && ny>=0 && ny<height){
              sum += src[ny*width + nx];
              cnt++;
            }
          }
        }
        dst[y*width + x] = sum / cnt;
      }
    }
  };

  const tmp = new Float32Array(width*height);
  blurPass(mask, tmp);
  blurPass(tmp, mask);

  // apply mask to image alpha channel
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const a = Math.round(mask[y*width + x]);
      const i = (y*width + x)*4;
      image.bitmap.data[i+3] = a;
    }
  }

  // compute bounding box of non-transparent pixels
  let minX=width, minY=height, maxX=0, maxY=0;
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const a = image.bitmap.data[(y*width + x)*4 + 3];
      if(a > 16){
        if(x<minX) minX=x;
        if(y<minY) minY=y;
        if(x>maxX) maxX=x;
        if(y>maxY) maxY=y;
      }
    }
  }

  if(maxX < minX || maxY < minY){
    console.error('No non-background content detected. Saving full image with transparency.');
    await image.writeAsync(outPath);
    console.log('Saved', outPath);
    return;
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const size = Math.max(cropW, cropH);
  // center crop to square around content
  const centerX = Math.floor((minX + maxX) / 2);
  const centerY = Math.floor((minY + maxY) / 2);
  const sx = Math.max(0, centerX - Math.floor(size/2));
  const sy = Math.max(0, centerY - Math.floor(size/2));
  // ensure within bounds
  const sxClamped = Math.min(Math.max(0, sx), width - size);
  const syClamped = Math.min(Math.max(0, sy), height - size);

  const cropped = image.clone().crop({ x: sxClamped, y: syClamped, w: size, h: size });
  await new Promise((res, rej) => cropped.write(outPath, err => err ? rej(err) : res()));
  console.log('Saved cropped icon to', outPath);
}

processWhiteBG().catch(err=>{ console.error(err); process.exit(1); });
