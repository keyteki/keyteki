/*eslint no-console:0 */
import commandLineArgs from 'command-line-args';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import CardGenerator from './generatecards/CardGenerator.js';
import JsonCardSource from './fetchdata/JsonCardSource.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
