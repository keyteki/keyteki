/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');

const CardImport = require('./fetchdata/CardImport');
const KeyforgeImageSource = require('./fetchdata/KeyforgeImageSource');
const JsonCardSource = require('./fetchdata/JsonCardSource');
const NoImageSource = require('./fetchdata/NoImageSource');
const db = require('../db');

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    {
        name: 'card-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'keyteki-json-data')
    },
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
    switch (options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir']);
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

let cardImport = new CardImport(dataSource, imageSource, options['image-dir'], options['language']);

const doImport = async () => {
    await cardImport.import();
    await db.shutdown();
};

doImport().then(() => {
    console.info('Done immporting and downloading images!');
});
