/*eslint no-console:0 */

const fs = require('fs');
const path = require('path');

const CardService = require('../services/CardService');
const DeckService = require('../services/DeckService');
const ConfigService = require('../services/ConfigService');

class ImportStandaloneDecks {
    constructor() {
        this.cardService = new CardService(new ConfigService());
        this.deckService = new DeckService();
    }

    async import() {
        try {
            this.cards = await this.cardService.getAllCards();

            for (const deck of this.loadDecks()) {
                const existingDeck = await this.deckService.getStandaloneDeckById(
                    deck.standaloneId
                );
                if (!existingDeck) {
                    console.log('Importing', deck.name);
                    await this.deckService.createStandalone(deck);
                }
            }

            console.log('Done importing standalone decks');
        } catch (err) {
            console.error('Could not finish import', err);
        }
    }

    loadDecks() {
        const data = fs.readFileSync(
            path.join(__dirname, '../../keyteki-json-data/standalone-decks.json')
        );
        return JSON.parse(data);
    }
}

const importer = new ImportStandaloneDecks();
importer.import();
