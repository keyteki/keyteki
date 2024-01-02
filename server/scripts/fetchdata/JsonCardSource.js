/*eslint no-console:0 */
const fs = require('fs');
const path = require('path');

class JsonCardSource {
    constructor(directory, codes, ids) {
        this.cards = this.loadPackFiles(directory, codes, ids);
    }

    loadPackFiles(directory, codes, ids) {
        let cards = [];
        let packs = [];
        let files = fs.readdirSync(path.join(directory, 'packs'));
        for (let file of files) {
            console.log(`Reading pack ${file}`);
            let pack = JSON.parse(fs.readFileSync(path.join(directory, 'packs', file)).toString());
            if (codes && codes.length > 0) {
                if (codes.includes(pack.code)) {
                    packs.push(pack);
                }
            } else {
                packs.push(pack);
            }
        }
        for (let pack of packs) {
            for (let card of pack.cards) {
                card.packCode = pack.code;
            }

            cards = cards.concat(
                pack.cards.filter((c) => !ids || ids.length === 0 || ids.includes(c.id))
            );
        }

        return cards;
    }

    getCards() {
        return this.cards;
    }
}

module.exports = JsonCardSource;
