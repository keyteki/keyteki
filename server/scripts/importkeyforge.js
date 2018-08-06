/*eslint no-console:0 */
const monk = require('monk');

const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let cardService = new CardService(db);
let deckService = new DeckService(db);

let rawData = require('./keyforge.json');
for(const card of rawData.CardData.filter(card => card.name !== '')) {
    card.id = card.name.toLowerCase().replace(/"\?.!/gi, '').replace(/[ ']/gi, '-');
    card.type = card.type.toLowerCase();
    card.house = card.house.toLowerCase();
    card.amber = card.amber === '' ? 0 : parseInt(card.amber);
    card.power = card.power === '' ? null : parseInt(card.power);
    card.armor = card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null;
    card.traits = card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase());
    card.keywords = card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase());
}
let fetchCards = cardService.replaceCards(rawData.CardData);
//let createDeck = deckService.findByUserName('public');

let createDeck = deckService.create({
    username: 'public',
    deckName: 'Arria, Moonhurst Monk',
    houses: ['logos', 'sanctum', 'untamed'],
    cards: [
        { id: 'foggify', count: 1 },
        { id: 'labwork', count: 2 },
        { id: 'library-access', count: 1 },
        { id: 'neuro-syphon', count: 1 },
        { id: 'remote-access', count: 1 },
        { id: 'batdrone', count: 2 },
        { id: 'dextre', count: 1 },
        { id: 'dr-escotera', count: 1 },
        { id: 'ganymede-archivist', count: 1 },
        { id: 'titan-mechanic', count: 1 },
        { id: 'begone', count: 1 },
        { id: 'shield-of-justice', count: 1 },
        { id: 'take-hostages', count: 1 },
        { id: 'virtuous-works', count: 1 },
        { id: 'potion-of-invulnerability', count: 2 },
        { id: 'sigil-of-brotherhood', count: 1 },
        { id: 'bulwark', count: 1 },
        { id: 'champion-anaphiel', count: 1 },
        { id: 'francus', count: 1 },
        { id: 'sargeant-zakiel', count: 1 },
        { id: 'staunch-knight', count: 1 },
        { id: 'save-the-pack', count: 1 },
        { id: 'ancient-bear', count: 2 },
        { id: 'dust-pixie', count: 1 },
        { id: 'flaxia', count: 1 },
        { id: 'inka-the-spider', count: 1 },
        { id: 'snufflegator', count: 2 },
        { id: 'mighty-tiger', count: 1 },
        { id: 'mushroom-man', count: 2 },
        { id: 'witch-of-the-eye', count: 1 }
    ]
});
Promise.all([fetchCards, createDeck])
    .then(results => {
        console.log(results);
        db.close();
    })
    .catch(() => db.close());
