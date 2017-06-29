/*eslint no-console:0 */
const request = require('request');
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/ringteki');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

var apiUrl = 'https://fiveringsdb.com/api/v1/';

function fetchImage(urlPath, code, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + code);
        var url = 'https://fiveringsdb.com/' + urlPath + code + '.png';
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

request.get(apiUrl + 'cards', function(error, res, body) {
    if(error) {
        console.error('Unable to fetch cards');
        return;
    }

    var cards_data = JSON.parse(body);
    var cards = cards_data.records;

    var imageDir = path.join(__dirname, '..', 'public', 'img', 'cards');
    mkdirp(imageDir);

    var i = 0;

    cards.forEach(function(card) {
        var imagePath = path.join(imageDir, card.code + '.png');
        var imagesrc = 'bundles/card_images/'

        if(imagesrc && !fs.existsSync(imagePath)) {
            fetchImage(imagesrc, card.code, imagePath, i++ * 200);
        }
    });

    db.collection('cards').remove({}, function() {
        db.collection('cards').insert(cards, function() {
            fs.writeFile('got-cards.json', JSON.stringify(cards), function() {
                console.info(cards_data.size + ' cards fetched');

                db.close();
            });
        });
    });
});

request.get(apiUrl + 'packs', function(error, res, body) {
    if(error) {
        console.error('Unable to fetch packs');
        return;
    }

    var packs_data = JSON.parse(body);
    var packs = packs_data.records;

    db.collection('packs').remove({}, function() {
        db.collection('packs').insert(packs, function() {
            fs.writeFile('got-packs.json', JSON.stringify(packs), function() {
                console.info(packs_data.size + ' packs fetched');
            });
        });
    });
});

