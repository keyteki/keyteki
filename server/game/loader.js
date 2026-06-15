const fs = require('fs');
const path = require('path');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

module.exports = {
    loadCards: function (basePath, directory) {
        var cards = {};

        for (const dir of getDirectories(directory)) {
            var normalisedPath = path.join(directory, dir);

            for (const file of fs.readdirSync(normalisedPath)) {
                var card = require('./cards/' + basePath + '/' + dir + '/' + file);

                cards[card.id] = card;
            }
        }

        return cards;
    }
};
