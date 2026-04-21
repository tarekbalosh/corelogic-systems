const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');

async function processImage() {
    const imgPath = 'public/ai_brain_hologram_1776488427249.png';
    const image = await loadImage(imgPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Convert dark pixels to transparent
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (r < 25 && g < 25 && b < 25) {
            data[i + 3] = 0; // Pure black/dark -> transparent
        } else if (lum < 60) {
            data[i + 3] = Math.max(0, Math.min(255, lum * 1.5));
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imgPath, buffer);
    console.log("Canvas processing complete, saved to", imgPath);
}

processImage().catch(console.error);
