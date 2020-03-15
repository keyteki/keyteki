/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const monk = require('monk');
const path = require('path');

const ConfigService = require('../services/ConfigService');
const CardImport = require('./fetchdata/CardImport');
const KeyforgeImageSource = require('./fetchdata/KeyforgeImageSource');
const JsonCardSource = require('./fetchdata/JsonCardSource');
const NoImageSource = require('./fetchdata/NoImageSource');

let configService = new ConfigService();

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    { name: 'card-dir', type: String, defaultValue: path.join(__dirname, '..', '..', 'keyteki-json-data') },
    { name: 'image-source', type: String, defaultValue: 'none' },
    { name: 'image-dir', type: String, defaultValue: path.join(__dirname, '..', '..', 'public', 'img', 'cards') },
    { name: 'no-images', type: Boolean, defaultValue: false },
    { name: 'language', type: String, defaultValue: 'en' }
];

function createDataSource(options) {
    switch(options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir']);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function createImageSource(options) {

    if(options['no-images']) {
        return new NoImageSource();
    }

    switch(options['image-source']) {
        case 'none':
            return new NoImageSource();
        case 'keyforge':
            return new KeyforgeImageSource();
        default:
            return new NoImageSource();
    }
}

let options = commandLineArgs(optionsDefinition);

let db = monk(configService.getValue('dbPath'));
let dataSource = createDataSource(options);
let imageSource = createImageSource(options);

let cardImport = new CardImport(db, dataSource, imageSource, options['image-dir'], options['language']);

cardImport.import();
