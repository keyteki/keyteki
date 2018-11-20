const monk = require('monk');

const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

let rawData = require('./keyforge.json');
for(const card of rawData.CardData.filter(card => card.name !== '')) {
    card.id = card.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
    card.type = card.type.toLowerCase();
    card.house = card.house.toLowerCase();
    card.amber = card.amber === '' ? 0 : parseInt(card.amber);
    card.power = card.power === '' ? null : parseInt(card.power);
    card.armor = card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null;
    card.traits = card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase());
    card.keywords = card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase());
}

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let cardService = new CardService(db);
let deckService = new DeckService(db);

deckService.decks.find()
    .then(decks => {
        for(let deck of decks) {
            console.log('checking', deck.name);
            for(let card of deck.cards) {
                if(!rawData.find(c => c.id === card.id)) {
                    console.log(card.id);
                }
            }
        }
    })
    .then(() => db.close())
    .catch(() => db.close());

// result.map(deck => deckService.delete(deck._id)
