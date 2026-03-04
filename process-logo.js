import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, 'public', 'icon.png');
const outputPath = path.join(__dirname, 'public', 'icon.png');

async function processLogo() {
  try {
    console.log(`Processing image: ${inputPath}`);
    
    // Read the image
    const image = await Jimp.read(inputPath);
    
    console.log(`Original size: ${image.width}x${image.height}`);
    
    // Process each pixel to remove white background
    image.scan(0, 0, image.width, image.height, (x, y, idx) => {
      const red = image.bitmap.data[idx];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];
      
      // If pixel is white or near-white, make it transparent
      if (red > 240 && green > 240 && blue > 240) {
        image.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    });
    
    // Save as PNG
    await image.write(outputPath);
    
    console.log(`✓ Successfully converted to ${outputPath}`);
    console.log(`✓ White background removed and replaced with transparency`);
    console.log(`✓ Output format: PNG with alpha channel`);
    
  } catch (error) {
    console.error('Error processing image:', error.message);
    process.exit(1);
  }
}

processLogo();
