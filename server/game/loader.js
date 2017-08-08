const fs = require('fs');
const path = require('path');
const _ = require('underscore');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

module.exports = {
    loadCards: function(basePath, directory) {
        var cards = {};

        _.each(getDirectories(directory), dir => {
            var normalisedPath = path.join(directory, dir);

            _.each(fs.readdirSync(normalisedPath), file => {
                var card = require('./cards/' + basePath + '/' + dir + '/' + file);

                cards[card.id] = card;
            });
        });

        return cards;
    }
};
