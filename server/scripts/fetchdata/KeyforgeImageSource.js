/*eslint no-console:0 */
import fs from 'fs';
import { fabric } from 'fabric';
import path from 'path';
import KeyForgeHalfSizeBuild from './KeyForgeHalfSizeBuild.js';
class KeyforgeImageSource {
    async fetchImage(card, imageUrl, imagePath) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            const buffer = Buffer.from(await response.arrayBuffer());
            await fs.promises.writeFile(imagePath, buffer);
            console.log('Downloaded image for ' + card.name + ' from ' + imageUrl);
        } catch (err) {
            console.log(`Error converting image for ${card.name}: ${err}`);
        }
    }

    getHalfSizeBuilder() {
        return KeyForgeHalfSizeBuild;
    }

    async buildGigantics(card, language, imageLangDir, imgPath) {
        console.log(`Built gigantic image for ${card.id} in ${language}`);
        const canvas = new fabric.StaticCanvas();
        canvas.renderOnAddRemove = false;
        canvas.setDimensions({ width: 300, height: 420 });
        const bottom = await this.loadImage(path.join(imageLangDir, card + '.png'));
        const top = await this.loadImage(path.join(imageLangDir, card + '2.png'));
        top.rotate(-90).scaleToWidth(300).set({ top: 210, left: 0 });
        bottom.rotate(-90).scaleToWidth(300).set({ top: 420, left: 0 });

        canvas.add(top);
        canvas.add(bottom);
        canvas.renderAll();
        const stream = canvas.createPNGStream();
        const out = fs.createWriteStream(imgPath);
        stream.on('data', (chunk) => {
            out.write(chunk);
        });
        stream.on('end', () => {
            canvas.dispose();
        });
    }

    loadImage(imgPath) {
        return new Promise((resolve) => {
            fabric.Image.fromURL(`file://${imgPath}`, (image) => resolve(image));
        });
    }
}

export default KeyforgeImageSource;
