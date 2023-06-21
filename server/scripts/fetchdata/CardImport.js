/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const fabric = require('fabric').fabric;

const CardService = require('../../services/CardService');
const ConfigService = require('../../services/ConfigService');

class CardImport {
    constructor(dataSource, imageSource, imageDir, language, buildHalfSize) {
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.language = language;
        this.buildHalfSize = buildHalfSize;
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

        cards = cards.sort((a, b) => (a.expansion > b.expansion ? -1 : 1));

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    async fetchImages(cards) {
        let imageLangDir;
        let halfSizeImageDir;

        if (this.language === 'en') {
            // Keep english images at the current folder
            imageLangDir = this.imageDir;
        } else {
            imageLangDir = path.join(this.imageDir, this.language.replace('-', ''));
        }
        halfSizeImageDir = imageLangDir.replace(`${path.sep}cards`, `${path.sep}halfSize`);
        mkdirp(imageLangDir);
        mkdirp(halfSizeImageDir);

        let specialCards = {
            479: { 'dark-æmber-vault': true, 'it-s-coming': true, 'orb-of-wonder': true },
            496: { 'orb-of-wonder': true, valoocanth: true }
        };

        const gigantic = ['deusillus', 'ultra-gravitron', 'niffle-kong'];

        for (let card of cards) {
            let imagePath = path.join(imageLangDir, card.id + '.png').replace('*', '_');
            let halfSizePath;

            let imageUrl = card.image
                .replace('/en/', '/' + this.language + '/')
                .replace('_en.', '_' + this.language + '.');

            if (specialCards[card.expansion] && specialCards[card.expansion][card.id]) {
                imagePath = path.join(imageLangDir, `${card.id}-${card.house}.png`);
            }

            if (!fs.existsSync(imagePath)) {
                await this.imageSource.fetchImage(card, imageUrl, imagePath);
            }

            halfSizePath = imagePath
                .replace(`${path.sep}cards`, `${path.sep}halfSize`)
                .replace('.png', '.jpg');
            if (!fs.existsSync(halfSizePath) && !gigantic.some((x) => card.id.includes(x))) {
                await this.buildHalfSize(card, card.image, halfSizePath, this.language);
            }
        }

        for (const card of gigantic) {
            let imgPath = path.join(imageLangDir, card + '-complete.png');
            let halfSizePath = imgPath
                .replace(`${path.sep}cards`, `${path.sep}halfSize`)
                .replace('.png', '.jpg');
            if (!fs.existsSync(imgPath)) {
                await this.buildGigantics(card, imageLangDir, imgPath);
                console.log('Built gigantic image for ' + card);
            }
            if (!fs.existsSync(halfSizePath)) {
                let data = cards.find((x) => x.id === card);
                await this.buildHalfSize(
                    { ...data, type: 'creature1' },
                    `file://${imgPath}`,
                    halfSizePath,
                    this.language
                );
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
            fabric.Image.fromURL(`file://${imgPath}`, (image) => {
                resolve(image);
            });
        });
    }
}

module.exports = CardImport;
