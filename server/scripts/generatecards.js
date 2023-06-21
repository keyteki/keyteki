/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

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
        defaultValue: path.join(__dirname, '..', 'game', 'generatedcards'),
        description: 'Where to put fully generated cards. Ignored if --overwrite is set'
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
    },
    {
        name: 'overwrite',
        type: Boolean,
        defaultValue: false,
        description:
            'Overwrites existing card implementations with generated ones to run automated tests on them'
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

let fullOutputDir = options['full-output-dir'];
let partialOutputDir = options['partial-output-dir'];

if (options.overwrite) {
    execSync('git diff --quiet');
    fullOutputDir = path.join(__dirname, '..', 'game', 'cards');
} else {
    fs.rmdirSync(fullOutputDir, { recursive: true });
}
fs.rmdirSync(partialOutputDir, { recursive: true });

let cardImport = new CardGenerator(dataSource, fullOutputDir, partialOutputDir, options.comments);

const doImport = async () => {
    await cardImport.generate();
};

doImport().then(() => {
    console.info('Done parsing and generating code!');
});
