const path = require('path');
const DecksOfKeyforgeApiToKeytekiConverter = require('../src/DecksOfKeyforgeApiToKeytekiConverter');

let converter = new DecksOfKeyforgeApiToKeytekiConverter();

converter
    .convert({
        pathToPackFile: path.join(process.cwd(), process.argv[2]),
        cyclePrefix: process.argv[3],
        language: process.argv.length > 4 ? process.argv[4] : 'en'
    })
    .then(() => console.info('complete!'))
    .catch((err) => console.info(err));
