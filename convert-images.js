var Jimp = require('jimp');
var fs = require('fs');
var path = './public/img/';
var cardpath = path + 'cards/';

Jimp.read(path+'watermark.png').then(watermark => {
    var files = fs.readdirSync(cardpath);
    files.forEach((filename) => {
        console.log("Converting " + filename + "..");
        Jimp.read(cardpath + filename)
        .then(image => {
            return image
                .resize(220, 307) // resize
                .composite( watermark,0,0,Jimp.BLEND_SOURCE_OVER)
                .quality(90) // set JPEG quality
                .write(cardpath + filename); // save
        })
        .catch(err => {
            console.error(err);
        });
    });
});
