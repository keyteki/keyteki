/*eslint no-console:0 */
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/ringteki');
const fs = require('fs');
const _ = require('underscore');

let files = fs.readdirSync('card-json/pack');
let totalCards = [];
let packs = JSON.parse(fs.readFileSync('card-json/packs.json'));
let types = JSON.parse(fs.readFileSync('card-json/types.json'));
let factions = JSON.parse(fs.readFileSync('card-json/factions.json'));

_.each(files, file => {
    let cards = JSON.parse(fs.readFileSync('card-json/pack/' + file));

    totalCards = totalCards.concat(cards);
});

_.each(totalCards, card => {
    let cardsByName = _.filter(totalCards, filterCard => {
        return filterCard.name === card.name;
    });

    if(cardsByName.length > 1) {
        card.label = card.name + ' (' + card.pack_code + ')';
    } else {
        card.label = card.name;
    }

    let faction = _.find(factions, faction => {
        return faction.code === card.faction_code;
    });

    let type = _.find(types, type => {
        return type.code === card.type_code;
    });

    if(faction) {
        card.faction_name = faction.name;
    } else {
        console.info(faction, card.faction_code);
    }

    if(type) {
        card.type_name = type.name;
    } else {
        console.info(card.type_code);
    }
});

db.collection('packs').remove({}, function() {
    db.collection('packs').insert(packs, function() {
        fs.writeFile('got-packs.json', JSON.stringify(packs), function() {
            console.info(packs.length + ' packs imported');
        });
    });
});

db.collection('cards').remove({}, function() {
    db.collection('cards').insert(totalCards, function() {
        fs.writeFile('got-cards.json', JSON.stringify(totalCards), function() {
            console.info(totalCards.length + ' cards imported');

            db.close();
        });
    });
});

