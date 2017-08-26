/*eslint no-console:0 */
const request = require('request');
const mongoskin = require('mongoskin');
const config = require('config');
const db = mongoskin.db(config.dbPath);
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

var apiUrl = 'https://fiveringsdb.com/';

function fetchImage(urlPath, id, imagePath, timeout) {
    setTimeout(function() {
        console.log('Downloading image for ' + id);
        var url = 'https://fiveringsdb.com/' + urlPath + id + '.jpg';
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

request.get(apiUrl + 'cards', function(error, res, body) {
    if(error) {
        console.error('Unable to fetch cards');
        return;
    }

    var cardsData = JSON.parse(body);
    var cards = cardsData.records;

    var imageDir = path.join(__dirname, '..', 'public', 'img', 'cards');
    mkdirp(imageDir);

    var i = 0;

    cards.forEach(function(card) {
        var imagePath = path.join(imageDir, card.id + '.jpg');
        var imagePack = card.pack_cards[0].pack.id;
        var imagesrc = 'bundles/card_images/' + imagePack + '/';


        if(imagesrc && !fs.existsSync(imagePath)) {
            fetchImage(imagesrc, card.id, imagePath, i++ * 200);
        }
    });

    db.collection('cards').remove({}, function() {
        db.collection('cards').insert(cards, function() {
            fs.writeFile('got-cards.json', JSON.stringify(cards), function() {
                console.info(cardsData.size + ' cards fetched');

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

    var packsData = JSON.parse(body);
    var packs = packsData.records;

    db.collection('packs').remove({}, function() {
        db.collection('packs').insert(packs, function() {
            fs.writeFile('got-packs.json', JSON.stringify(packs), function() {
                console.info(packsData.size + ' packs fetched');
            });
        });
    });
});

