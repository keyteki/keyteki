import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getDirectories(srcpath) {
    let fullPath = path.join(__dirname, srcpath);
    return fs.readdirSync(fullPath).filter(function (file) {
        return fs.statSync(path.join(fullPath, file)).isDirectory();
    });
}

async function loadFiles(directory) {
    let fullPath = path.join(__dirname, directory);
    let files = fs.readdirSync(fullPath).filter((file) => {
        return !fs.statSync(path.join(fullPath, file)).isDirectory();
    });

    for (let file of files) {
        const cardPath = path.join(__dirname, directory, file);
        const cardModule = await import(pathToFileURL(cardPath).href);
        let card = cardModule.default;

        if (!card || !card.id) {
            continue;
        }

        cards[card.id] = card;
    }
}

async function loadCards(directory) {
    let cards = {};

    await loadFiles(directory);

    for (const dir of getDirectories(directory)) {
        cards = Object.assign(cards, await loadCards(path.join(directory, dir)));
    }

    return cards;
}

let cards = {};
let directories = getDirectories('.');

for (let directory of directories) {
    cards = Object.assign(cards, await loadCards(directory));
}

export default cards;
