import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getDirectories(srcpath) {
    let fullPath = path.join(__dirname, srcpath);
    return fs.readdirSync(fullPath).filter(function (file) {
        return fs.statSync(path.join(fullPath, file)).isDirectory();
    });
}

async function loadFiles(directory, cards) {
    let fullPath = path.join(__dirname, directory);
    let files = fs.readdirSync(fullPath).filter((file) => {
        return !fs.statSync(path.join(fullPath, file)).isDirectory() && file.endsWith('.js');
    });

    for (let file of files) {
        let module = await import('./' + directory + '/' + file);
        let card = module.default;
        if (card && card.id) {
            cards[card.id] = card;
        }
    }
}

async function loadCards(directory) {
    let cards = {};

    await loadFiles(directory, cards);

    let directories = getDirectories(directory);
    for (let dir of directories) {
        let subCards = await loadCards(path.join(directory, dir));
        cards = Object.assign(cards, subCards);
    }

    return cards;
}

let cards = {};
let directories = getDirectories('.');

for (let directory of directories) {
    let dirCards = await loadCards(directory);
    cards = Object.assign(cards, dirCards);
}

export default cards;
