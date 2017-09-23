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

function fetchImage(urlPath, id, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + id);
        var url = 'https://fiveringsdb.com/' + urlPath + id + '.jpg';
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

let db = monk('mongodb://127.0.0.1:27017/throneteki');
let cardService = new CardService(db);

let fetchCards = apiRequest('cards')
    .then(cards => cardService.replaceCards(cards))
    .then(cards => {
        console.info(cards.length + ' cards fetched');

        let imageDir = path.join(__dirname, '..', '..', 'public', 'img', 'cards');
        mkdirp(imageDir);

        var i = 0;

        cards.forEach(function(card) {
            var imagePath = path.join(imageDir, card.id + '.jpg');
            //var imagePack = card.pack_cards[0].pack.id;
            //var imagesrc = 'static/cards/' + imagePack + '/';

            if(card.imagesrc && !fs.existsSync(imagePath)) {
                fetchImage(card.imagesrc, card.code, imagePath, i++ * 200);
            }
        });

        return cards;
    })
    .catch(() => {
        console.error('Unable to fetch cards');
    });

let fetchPacks = apiRequest('packs')
    .then(packs => cardService.replacePacks(packs))
    .then(packs => {
        console.info(packs.length + ' packs fetched');
    })
    .catch(() => {
        console.error('Unable to fetch packs');
    });

Promise.all([fetchCards, fetchPacks])
    .then(() => db.close())
    .catch(() => db.close());

