import fs from 'fs';
import path from 'path';
import _ from 'underscore';

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

export function loadCards(basePath, directory) {
    var cards = {};

    _.each(getDirectories(directory), (dir) => {
        var normalisedPath = path.join(directory, dir);

        _.each(fs.readdirSync(normalisedPath), (file) => {
            // Note: This file is no longer used with the new dynamic ESM loader
            // Keeping for backward compatibility but will need refactoring
            cards[file] = file; // Placeholder
        });
    });

    return cards;
}
