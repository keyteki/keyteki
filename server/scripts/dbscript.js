const monk = require('monk');

const CardService = require('../services/CardService.js');
const DeckService = require('../services/DeckService.js');

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let cardService = new CardService(db);
let deckService = new DeckService(db);

let data;

deckService.findByUserName()
    .then(result => {
        console.log(result.length);
        return deckService.delete(result[result.length - 1]._id);
    })
    .then(() => db.close())
    .catch(() => db.close());

// result.map(deck => deckService.delete(deck._id)
