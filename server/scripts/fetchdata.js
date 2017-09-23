/*eslint no-console:0 */
const request = require('request');
const monk = require('monk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../services/CardService.js');

function apiRequest(path) {
    const apiUrl = 'https://api.fiveringsdb.com/';

    return new Promise((resolve, reject) => {
        request.get(apiUrl + path, function(error, res, body) {
            if(error) {
                return reject(error);
            }

            resolve(JSON.parse(body));
        });
    });
}

function fetchImage(url, id, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + id);
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

let db = monk('mongodb://127.0.0.1:27017/ringteki');
let cardService = new CardService(db);

let fetchCards = apiRequest('cards')
    .then(cards => cardService.replaceCards(cards.records))
    .then(cards => {
        console.info(cards.length + ' cards fetched');

        let imageDir = path.join(__dirname, '..', '..', 'public', 'img', 'cards');
        mkdirp(imageDir);

        var i = 0;

        cards.forEach(function(card) {
            var imagePath = path.join(imageDir, card.id + '.jpg');
            var imagesrc = card.pack_cards[0].image_url;


            if(imagesrc && !fs.existsSync(imagePath)) {
                fetchImage(imagesrc, card.id, imagePath, i++ * 200);
            }
        });

        return cards;
    })
    .catch(() => {
        console.error('Unable to fetch cards');
    });

let fetchPacks = apiRequest('packs')
    .then(packs => cardService.replacePacks(packs.records))
    .then(packs => {
        console.info(packs.length + ' packs fetched');
    })
    .catch(() => {
        console.error('Unable to fetch packs');
    });

Promise.all([fetchCards, fetchPacks])
    .then(() => db.close())
    .catch(() => db.close());

