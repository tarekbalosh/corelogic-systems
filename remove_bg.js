const jimp = require('jimp');

async function removeBg() {
    try {
        console.log("Starting...");
        const imgPath = 'public/ai_brain_hologram_1776488427249.png';
        const Jimp = jimp.Jimp || require('jimp');
        
        let img;
        if (typeof Jimp.read === 'function') {
            img = await Jimp.read(imgPath);
        } else if (typeof jimp.read === 'function') {
            img = await jimp.read(imgPath);
        } else {
            const { read } = require('jimp');
            img = await read(imgPath);
        }

        console.log("Image loaded.");
        
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            
            if (r < 25 && g < 25 && b < 25) {
                this.bitmap.data[idx + 3] = 0; 
            } else if (lum < 60) {
                this.bitmap.data[idx + 3] = Math.max(0, Math.min(255, lum * 1.5));
            }
        });
        
        if (typeof img.writeAsync === 'function') {
             await img.writeAsync(imgPath);
        } else if (typeof img.write === 'function') {
             // either returns a promise or uses callback
             try {
                await img.write(imgPath); 
             } catch(e) {
                 await new Promise((res, rej) => img.write(imgPath, (err) => err ? rej(err) : res()));
             }
        }
        console.log("Image processed successfully!");
    } catch (err) {
        console.error("Fatal error:", err);
    }
}
removeBg();
