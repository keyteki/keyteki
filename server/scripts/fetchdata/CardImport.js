/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const fabric = require('fabric').fabric;

const CardService = require('../../services/CardService');
const ConfigService = require('../../services/ConfigService');

class CardImport {
    constructor(dataSource, imageSource, imageDir, language) {
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.language = language;
        this.cardService = new CardService(new ConfigService());
    }

    async import() {
        try {
            await this.importCards();
        } catch (e) {
            console.log('Unable to fetch data', e);
        }

        this.cardService.shutdown();
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    async fetchImages(cards) {
        let imageLangDir;

        if (this.language === 'en') {
            // Keep english images at the current folder
            imageLangDir = this.imageDir;
        } else {
            imageLangDir = path.join(this.imageDir, this.language.replace('-', ''));
        }

        mkdirp(imageLangDir);

        let specialCards = {
            479: { 'dark-æmber-vault': true, 'it-s-coming': true, 'orb-of-wonder': true }
        };

        const gigantic = ['deusillus', 'ultra-gravitron', 'niffle-kong'];

        for (let card of cards) {
            let imagePath = path.join(imageLangDir, card.id + '.png');

            let imageUrl = card.image
                .replace('/en/', '/' + this.language + '/')
                .replace('_en.', '_' + this.language + '.');

            if (specialCards[card.expansion] && specialCards[card.expansion][card.id]) {
                imagePath = path.join(imageLangDir, `${card.id}-${card.house}.png`);
            }

            if (!fs.existsSync(imagePath)) {
                await this.imageSource.fetchImage(card, imageUrl, imagePath);
            }
        }

        for (const card of gigantic) {
            let imgPath = path.join(imageLangDir, card + '-complete.png');
            if (!fs.existsSync(imgPath)) {
                await this.buildGigantics(card, imageLangDir, imgPath);
            }
        }
    }

    async buildGigantics(card, imageLangDir, imgPath) {
        const canvas = new fabric.StaticCanvas();
        canvas.setDimensions({ width: 300, height: 420 });
        const bottom = await this.loadImage(path.join(imageLangDir, card + '.png'));
        const top = await this.loadImage(path.join(imageLangDir, card + '2.png'));
        top.rotate(-90).scaleToWidth(300).set({ top: 210, left: 0 });
        bottom.rotate(-90).scaleToWidth(300).set({ top: 420, left: 0 });
        canvas.add(top);
        canvas.add(bottom);
        canvas.renderAll();
        let dataUrl = canvas.toDataURL();
        let base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        await fs.writeFileSync(imgPath, base64Data, 'base64');
        console.log('Built gigantic image for ' + card);
    }

    loadImage(imgPath) {
        return new Promise((resolve) => {
            fabric.Image.fromURL(`file://${imgPath}`, (image) => {
                resolve(image);
            });
        });
    }
}

module.exports = CardImport;
