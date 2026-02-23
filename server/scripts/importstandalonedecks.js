/*eslint no-console:0 */

import fs from 'fs';
import path from 'path';
import CardService from '../services/CardService.js';
import DeckService from '../services/DeckService.js';
import ConfigService from '../services/ConfigService.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
class ImportStandaloneDecks {
    constructor() {
        this.cardService = new CardService(new ConfigService());
        this.deckService = new DeckService();
    }

    async import() {
        try {
            this.cards = await this.cardService.getAllCards();

            for (let deck of this.loadDecks()) {
                let existingDeck = await this.deckService.getStandaloneDeckById(deck.standaloneId);
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
        let data = fs.readFileSync(
            path.join(__dirname, '../../keyteki-json-data/standalone-decks.json')
        );
        return JSON.parse(data);
    }
}

let importer = new ImportStandaloneDecks();
importer.import();
