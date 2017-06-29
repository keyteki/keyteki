/*eslint no-console:0 */
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/ringteki');
const fs = require('fs');
const _ = require('underscore');

let files = fs.readdirSync('fiveringdsdb-data/Card');
let totalCards = [];
let packs = JSON.parse(fs.readFileSync('fiveringdsdb-data/Pack.json'));
let types = JSON.parse(fs.readFileSync('fiveringdsdb-data/Type.json'));
let clans = JSON.parse(fs.readFileSync('fiveringdsdb-data/Clan.json'));

_.each(files, file => {
    let card = JSON.parse(fs.readFileSync('fiveringdsdb-data/Card/' + file));

    totalCards = totalCards.concat(card);
});

_.each(totalCards, card => {
    let cardsByName = _.filter(totalCards, filterCard => {
        return filterCard.name === card.code;
    });

    if(cardsByName.length > 1) {
        card.label = card.code + ' (' + card.pack_code + ')';
    } else {
        card.label = card.code;
    }

    let clan = _.find(clans, clan => {
        return clan.code === card.clan_code;
    });

    let type = _.find(types, type => {
        return type.code === card.type_code;
    });

    if(clan) {
        card.clan_name = clan.name;
    } else {
        console.info(clan, card.clan_code);
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

