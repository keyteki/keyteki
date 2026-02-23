import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

export async function loadCards(basePath, directory) {
    let cards = {};

    for (const dir of getDirectories(directory)) {
        const normalisedPath = path.join(directory, dir);

        for (const file of fs.readdirSync(normalisedPath)) {
            const modulePath = path.join(__dirname, 'cards', basePath, dir, file);
            const cardModule = await import(pathToFileURL(modulePath).href);
            const card = cardModule.default;

            if (!card || !card.id) {
                continue;
            }

            cards[card.id] = card;
        }
    }

    return cards;
}

export default {
    loadCards
};
