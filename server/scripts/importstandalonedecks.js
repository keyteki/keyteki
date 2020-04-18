/*eslint no-console:0 */

const fs = require('fs');
const monk = require('monk');
const path = require('path');

const ConfigService = require('../services/ConfigService');
const CardService = require('../services/CardService');
const DeckService = require('../services/DeckService');

let configService = new ConfigService();

class ImportStandaloneDecks {
    constructor() {
        this.db = monk(configService.getValue('dbPath'));
        this.cardService = new CardService(this.db);
        this.deckService = new DeckService(this.db);
    }

    async import() {
        try {
            this.cards = await this.cardService.getAllCards();

            for(let deck of this.loadDecks()) {
                let existingDeck = await this.deckService.getByStandaloneId(deck.standaloneId);
                if(!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createStandalone(deck);
                }
            }

            console.log('Done importing standalone decks');
        } catch(err) {
            console.error('Could not finish import', err);
        } finally {
            this.db.close();
        }
    }

    loadDecks() {
        let data = fs.readFileSync(path.join(__dirname, '../../keyteki-json-data/standalone-decks.json'));
        return JSON.parse(data);
    }
}

let importer = new ImportStandaloneDecks();
importer.import();
