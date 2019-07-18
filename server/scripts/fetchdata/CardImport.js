/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../../services/CardService.js');

class CardImport {
    constructor(db, dataSource, imageSource, imageDir) {
        this.db = db;
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.cardService = new CardService(db);
    }

    async import() {
        try {
            await this.importCards();
        } catch(e) {
            console.log('Unable to fetch data', e);
        } finally {
            this.db.close();
        }
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    fetchImages(cards) {
        mkdirp(this.imageDir);

        let i = 0;

        for(let card of cards) {
            let imagePath = path.join(this.imageDir, card.id + '.png');

            if(!fs.existsSync(imagePath)) {
                setTimeout(() => {
                    this.imageSource.fetchImage(card, imagePath);
                }, i++ * 200);
            }
        }
    }
}

module.exports = CardImport;
