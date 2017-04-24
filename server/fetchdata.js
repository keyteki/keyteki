/*eslint no-console:0 */
const request = require('request');
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

var apiUrl = 'https://thronesdb.com/api/public/';

function fetchImage(urlPath, code, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + code);
        var url = 'https://thronesdb.com/' + urlPath;
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

request.get(apiUrl + 'cards', function(error, res, body) {
    if(error) {
        console.error('Unable to fetch cards');
        return;
    }

    var cards = JSON.parse(body);

    var imageDir = path.join(__dirname, '..', 'public', 'img', 'cards');
    mkdirp(imageDir);

    var i = 0;

    cards.forEach(function(card) {
        var imagePath = path.join(imageDir, card.code + '.png');

        if(card.imagesrc && !fs.existsSync(imagePath)) {
            fetchImage(card.imagesrc, card.code, imagePath, i++ * 200);
        }
    });

    db.collection('cards').remove({}, function() {
        db.collection('cards').insert(cards, function() {
            fs.writeFile('got-cards.json', JSON.stringify(cards), function() {
                console.info(cards.length + ' cards fetched');

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

    var packs = JSON.parse(body);

    db.collection('packs').remove({}, function() {
        db.collection('packs').insert(packs, function() {
            fs.writeFile('got-packs.json', JSON.stringify(packs), function() {
                console.info(packs.length + ' packs fetched');
            });
        });
    });
});

