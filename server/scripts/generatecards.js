/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');

const CardGenerator = require('./generatecards/CardGenerator');
const JsonCardSource = require('./fetchdata/JsonCardSource');

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    {
        name: 'card-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'keyteki-json-data')
    },
    {
        name: 'full-output-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', 'game', 'generatedcards')
    },
    {
        name: 'partial-output-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', 'game', 'partialcards')
    },
    {
        name: 'comments',
        type: String,
        defaultValue: 'text',
        description: 'How much information to include in code comments: none, text, short or all'
    }
];

function createDataSource(options) {
    switch (options['card-source']) {
        case 'json':
            return new JsonCardSource(options['card-dir']);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

let options = commandLineArgs(optionsDefinition);

let dataSource = createDataSource(options);

let cardImport = new CardGenerator(
    dataSource,
    options['full-output-dir'],
    options['partial-output-dir'],
    options.comments
);

const doImport = async () => {
    await cardImport.generate();
};

doImport().then(() => {
    console.info('Done parsing and generating code!');
});
