/*eslint no-console:0 */
const fs = require('fs');
const path = require('path');

class JsonCardSource {
    constructor(directory, codes, ids) {
        this.cards = this.loadPackFiles(directory, codes, ids);
    }

    loadPackFiles(directory, codes, ids) {
        let cards = [];
        const packs = [];
        const files = fs.readdirSync(path.join(directory, 'packs'));
        for (const file of files) {
            console.log(`Reading pack ${file}`);
            const pack = JSON.parse(
                fs.readFileSync(path.join(directory, 'packs', file)).toString()
            );
            if (codes && codes.length > 0) {
                if (codes.includes(pack.code)) {
                    packs.push(pack);
                }
            } else {
                packs.push(pack);
            }
        }
        for (const pack of packs) {
            for (const card of pack.cards) {
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
