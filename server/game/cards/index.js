const _ = require('underscore');
const fs = require('fs');
const path = require('path');

function getDirectories(srcpath) {
    let fullPath = path.join(__dirname, srcpath);
    return fs.readdirSync(fullPath).filter(function(file) {
        return fs.statSync(path.join(fullPath, file)).isDirectory();
    });
}

function loadFiles(directory) {
    let fullPath = path.join(__dirname, directory);
    let files = fs.readdirSync(fullPath).filter(file => {
        return !fs.statSync(path.join(fullPath, file)).isDirectory();
    });

    for(let file of files) {
        let card = require('./' + directory + '/' + file);

        cards[card.id] = card;
    }
}

function loadCards(directory) {
    let cards = {};

    loadFiles(directory);

    _.each(getDirectories(directory), dir => {
        cards = Object.assign(cards, loadCards(path.join(directory, dir)));
    });

    return cards;
}

let cards = {};
let directories = getDirectories('.');

for(let directory of directories) {
    cards = Object.assign(cards, loadCards(directory));
}

module.exports = cards;
