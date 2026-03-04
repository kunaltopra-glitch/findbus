import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processIcon() {
  try {
    console.log('Loading icon.png...');
    const image = await Jimp.read(path.join(__dirname, 'public/icon.png'));
    
    console.log('Processing image - removing dark background with edge preservation...');
    
    // Get image dimensions
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // First pass: Create alpha layer based on brightness
    const alphaData = new Uint8Array(width * height);
    
    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate brightness using standard luminance formula
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // Use a smoother threshold for better edge preservation
      let alpha = 255;
      if (brightness < 30) {
        alpha = 0; // Pure black background - fully transparent
      } else if (brightness < 50) {
        // Transition zone - gradual transparency
        alpha = Math.round(((brightness - 30) / 20) * 255);
      }
      
      alphaData[y * width + x] = alpha;
    });
    
    // Apply the alpha layer
    image.scan(0, 0, width, height, function(x, y, idx) {
      const alpha = alphaData[y * width + x];
      this.bitmap.data[idx + 3] = alpha;
    });
    
    // Export as PNG with transparency
    const outputPath = path.join(__dirname, 'public/icon.png');
    await image.write(outputPath);
    
    console.log(`✓ Success! Icon processed and saved to: ${outputPath}`);
    console.log(`✓ Image size: ${width} x ${height} pixels`);
    console.log(`✓ Background removed with smooth edges preserved`);
    console.log(`✓ Format: PNG with full transparency support`);
  } catch (error) {
    console.error('Error processing icon:', error);
    process.exit(1);
  }
}

processIcon();
