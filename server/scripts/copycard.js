/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');

const optionsDefinition = [
    { name: 'cards-dir', type: String, defaultValue: path.join(__dirname, '..', 'game', 'cards') },
    { name: 'source', type: String },
    { name: 'target', type: String },
    { name: 'tid', type: String },
    { name: 'tpack', type: String, defaultValue: '03-WC' }
];

let options = commandLineArgs(optionsDefinition);

function findFile(dirPath, targetFile) {
    var files = fs.readdirSync(dirPath);
    for (var i = 0; i < files.length; ++i) {
        var filename = path.join(dirPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            let foundFile = findFile(filename, targetFile);
            if (foundFile) {
                return foundFile;
            }
        } else if (filename.endsWith(targetFile)) {
            return fs.readFileSync(filename, 'utf8');
        }
    }

    return null;
}

function copyCard(cardsDir, source, target, tid, tpack) {
    let sourceName = source + '.js';
    let card = findFile(cardsDir, sourceName);

    if (!card) {
        console.log('Unable to find card: ' + sourceName);
        return -1;
    }

    card = card.replace(new RegExp(source, 'g'), target);
    card = card.replace(new RegExp(target + "\\.id = '.*';", 'g'), target + ".id = '" + tid + "';");

    let targetFile = path.join(cardsDir, tpack, target + '.js');

    fs.writeFileSync(targetFile, card);
    console.log('File saved: ' + targetFile);

    return 0;
}

// example usage
// node server/scripts/copycard.js --source=Rustgnawer --target=Hock --tid=hock
copyCard(
    options['cards-dir'],
    options['source'],
    options['target'],
    options['tid'],
    options['tpack']
);
