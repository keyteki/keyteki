/*eslint no-console:0 */
const fs = require('fs');
const request = require('request');

class KeyforgeImageSource {
    fetchImage(card, imageUrl, imagePath) {
        return new Promise((resolve) => {
            let file = fs.createWriteStream(imagePath);
            request({ url: imageUrl, encoding: null })
                .pipe(file)
                .on('finish', () => {
                    console.log('Downloaded image for ' + card.name + ' from ' + imageUrl);
                    resolve();
                })
                .on('error', (err) => {
                    console.log(`Error converting image for ${card.name}: ${err}`);
                    resolve();
                });
        });
    }
}

module.exports = KeyforgeImageSource;
