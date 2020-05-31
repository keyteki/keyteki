/*eslint no-console:0 */
const _ = require('underscore');
const monk = require('monk');
const DeckService = require('../services/DeckService.js');

let db = monk('mongodb://127.0.0.1:27017/keyforge');
let deckService = new DeckService(db);
deckService.decks
    .aggregate([{ $match: { includeInSealed: false } }, { $sortByCount: '$uuid' }])
    .then((results) =>
        _.shuffle(results.filter((entry) => entry._id && entry.count === 1)).slice(0, 3)
    )
    .then((results) =>
        Promise.all(
            results.map((entry) =>
                deckService.decks.update({ uuid: entry._id }, { $set: { includeInSealed: true } })
            )
        )
    )
    .then((results) => console.log(results))
    .then(() => db.close())
    .catch(() => db.close());
