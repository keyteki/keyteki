/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

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
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    fetchImages(cards) {
        let imageLangDir;

        if (this.language === 'en') {
            // Keep english images at the current folder
            imageLangDir = this.imageDir;
        } else {
            imageLangDir = path.join(this.imageDir, this.language.replace('-', ''));
        }

        mkdirp(imageLangDir);

        let i = 0;
        let specialCards = {
            479: { 'dark-æmber-vault': true, 'it-s-coming': true, 'orb-of-wonder': true }
        };

        for (let card of cards) {
            let imagePath = path.join(imageLangDir, card.id + '.png');

            let imageUrl = card.image
                .replace('/en/', '/' + this.language + '/')
                .replace('_en.', '_' + this.language + '.');

            if (specialCards[card.expansion] && specialCards[card.expansion][card.id]) {
                imagePath = path.join(imageLangDir, `${card.id}-${card.house}.png`);
            }

            if (!fs.existsSync(imagePath)) {
                setTimeout(() => {
                    this.imageSource.fetchImage(card, imageUrl, imagePath);
                }, i++ * 200);
            }
        }
    }
}

module.exports = CardImport;
