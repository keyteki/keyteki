/*eslint no-console:0 */
const jimp = require('jimp');
const request = require('request');

class KeyforgeImageSource {
    fetchImage(card, imagePath) {
        request({ url: card.image, encoding: null }, function(err, response, body) {
            if(err || response.statusCode !== 200) {
                console.log(`Unable to fetch image for ${card.name} from ${card.image}`);
                return;
            }

            console.log('Downloading image for ' + card.name);
            jimp.read(body).then(lenna => {
                lenna.write(imagePath);
            }).catch(err => {
                console.log(`Error converting image for ${card.name}: ${err}`);
            });
        });
    }
}

module.exports = KeyforgeImageSource;
