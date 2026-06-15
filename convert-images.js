/* eslint-disable no-console */
const Jimp = require('jimp');
const fs = require('fs');
const path = './public/img/';
const cardpath = path + 'cardsResize/';

Jimp.read(path + 'watermark.png').then((watermark) => {
    const files = fs.readdirSync(cardpath);
    files.forEach((filename) => {
        console.log('Converting ' + filename + '..');
        Jimp.read(cardpath + filename)
            .then((image) => {
                const name = filename.replace('.' + image.getExtension(), '');
                return image
                    .resize(220, 307) // resize
                    .composite(watermark, 0, 0, Jimp.BLEND_SOURCE_OVER)
                    .quality(90) // set JPEG quality
                    .write(cardpath + name + '.jpg'); // save
            })
            .catch((err) => {
                console.error(err);
            });
    });
});
