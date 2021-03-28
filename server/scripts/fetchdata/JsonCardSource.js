/*eslint no-console:0 */
const fs = require('fs');
const path = require('path');

class JsonCardSource {
    constructor(directory) {
        this.cards = this.loadPackFiles(directory);
    }

    loadPackFiles(directory) {
        let cards = [];
        let files = fs.readdirSync(path.join(directory, 'packs'));
        for (let file of files) {
            let pack = JSON.parse(fs.readFileSync(path.join(directory, 'packs', file)));
            for (let card of pack.cards) {
                card.packCode = pack.code;
            }

            cards = cards.concat(pack.cards);
        }

        return cards;
    }

    getCards() {
        return this.cards;
    }
}

module.exports = JsonCardSource;
