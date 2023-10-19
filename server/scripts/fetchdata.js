/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');

const CardImport = require('./fetchdata/CardImport');
const KeyforgeImageSource = require('./fetchdata/KeyforgeImageSource');
const JsonCardSource = require('./fetchdata/JsonCardSource');
const NoImageSource = require('./fetchdata/NoImageSource');
const db = require('../db');

//
// Sample Commands
//
// #1 Fetch all images, skipping existing images, in English
// node server/scripts/fetchdata
//
// #2 Fetch all images, skipping existing images, in a specific language
// node server/scripts/fetchdata --language pt
//
// #3 Fetch all images, skipping existing images, in a all languages
// node server/scripts/fetchdata --language all
//
// #4 Fetch specific set, skipping existing images, in English
// node server/scripts/fetchdata --code WoE
//
// #5 Fetch specific set and card, skipping existing images, in English
// node server/scripts/fetchdata --code WoE --id pupgrade
//
// #6 Fetch specific set, forcing overwrite of existing images, in all languages
// node server/scripts/fetchdata --code WoE --language all --force
//
// #7 Fetch all sets, forcing download and overwrite of all images, in all languages
// node server/scripts/fetchdata --language all --force
//
const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    {
        name: 'card-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'keyteki-json-data')
    },
    { name: 'code', type: String, defaultValue: '' },
    { name: 'id', type: String, defaultValue: '' },
    { name: 'skip-replace', type: Boolean, defaultValue: false },
    { name: 'force', type: Boolean, defaultValue: false },
    { name: 'image-source', type: String, defaultValue: 'keyforge' },
    {
        name: 'image-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'public', 'img', 'cards')
    },
    { name: 'no-images', type: Boolean, defaultValue: false },
    { name: 'language', type: String, defaultValue: 'en' }
];

function createDataSource(options) {
    let codes = options['code'].split(',').filter(Boolean);
    let ids = options['id'].split(',').filter(Boolean);
    switch (options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir'], codes, ids);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function createImageSource(options) {
    if (options['no-images']) {
        return new NoImageSource();
    }

    switch (options['image-source']) {
        case 'none':
            return new NoImageSource();
        case 'keyforge':
            return new KeyforgeImageSource();
    }

    throw new Error(`Unknown image source '${options['image-source']}'`);
}

let options = commandLineArgs(optionsDefinition);

let dataSource = createDataSource(options);
let imageSource = createImageSource(options);

let cardImport = new CardImport(
    dataSource,
    imageSource,
    options['image-dir'],
    options['language'],
    options['force'],
    options['skip-replace']
);

const doImport = async () => {
    await cardImport.import();
    await db.shutdown();
};

doImport().then(() => {
    console.info('Done importing and downloading images!');
});
