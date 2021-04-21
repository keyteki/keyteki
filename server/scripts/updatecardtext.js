/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');
const JsonCardSource = require('./fetchdata/JsonCardSource');

const optionsDefinition = [
    { name: 'card-source', type: String, defaultValue: 'json' },
    {
        name: 'cards-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'server', 'game', 'cards')
    },
    { name: 'pack', type: String, defaultValue: '05-DT' },
    { name: 'card-id', type: String },
    {
        name: 'pack-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'keyteki-json-data')
    }
];

function createDataSource(options) {
    switch (options['card-source']) {
        case 'json':
            return new JsonCardSource(options['pack-dir']);
    }

    throw new Error(`Unknown card source '${options['card-source']}'`);
}

function loadCardFiles(id, dir, result) {
    let files = fs.readdirSync(dir);

    for (let file of files) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            if (loadCardFiles(id, path.join(dir, file), result)) {
                return true;
            }
        } else {
            const filepath = path.resolve(dir, file);
            const content = fs.readFileSync(filepath);
            if (id) {
                if (content.includes("= '" + id + "';")) {
                    result[id] = filepath;
                    return true;
                }
            } else {
                let match = content.toString().match(/\.id = '(.*)';/);
                if (match) {
                    result[match[1]] = filepath;
                }
            }
        }
    }
    return false;
}

function prepareText(text) {
    let lines = text
        .replace(/\uf360/g, 'A')
        .replace(/\uf361/g, 'D')
        .replace(/\uf565/g, 'PT')
        .replace(/\uf36e/g, 'R')
        .replace(/\uF566/g, '(T)')
        .replace(/\uFEFF/g, '')
        .split(/\r?\n|\r/g);
    let output = '';
    for (let line of lines) {
        output += '    // ' + line + '\n';
    }
    return output;
}

let options = commandLineArgs(optionsDefinition);
let cardId = options['card-id'];
let dataSource = createDataSource(options);
let cards = dataSource.cards;

function processFile(file, card) {
    const content = fs.readFileSync(file).toString();
    let output = '';
    let foundClass = false;
    let foundSetupCardAbilities = false;
    let lines = content.toString().split(/\n|\r\n/);
    for (let line of lines) {
        if (foundSetupCardAbilities) {
            output += line + '\n';
            continue;
        }

        if (line.includes('class') && line.includes(' extends ')) {
            output += line + '\n';
            foundClass = true;
            continue;
        }

        if (!foundClass) {
            output += line + '\n';
            continue;
        }

        if (foundClass && line.startsWith('    //')) {
            continue;
        }

        if (line.startsWith('    setupCardAbilities')) {
            foundSetupCardAbilities = true;
            output += prepareText(card.text);
            output += line + '\n';
            continue;
        }

        if (foundClass && !foundSetupCardAbilities && !line.startsWith('    //')) {
            console.log('Process manually: ', file, line);
            return;
        }
    }

    output = output.replace(/\n$/, '');

    fs.writeFileSync(file, output);
}

let result = {};

loadCardFiles(cardId, options['cards-dir'], result);

for (let id of Object.keys(result)) {
    let file = result[id];
    if (file.includes(options['pack'])) {
        processFile(
            file,
            cards.find((c) => c.id === id)
        );
    }
}
