const fs = require('fs');
const path = require('path');

// Map cardId -> filePath (built by scanning files without requiring them)
const cardIdToPath = {};
// Cache of loaded card classes
const loadedCards = {};

/**
 * Extract card.id from file contents without requiring the module
 * Looks for pattern: CardName.id = 'card-id' or CardName.id = "card-id"
 */
function extractCardId(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Match: SomeClass.id = 'card-id' or SomeClass.id = "card-id"
        const match = content.match(/\.id\s*=\s*['"]([^'"]+)['"]/);
        return match ? match[1] : null;
    } catch (e) {
        return null;
    }
}

/**
 * Scan directories and extract card IDs from file contents
 */
function scanDirectory(directory) {
    const fullPath = path.join(__dirname, directory);
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            scanDirectory(path.join(directory, entry.name));
        } else if (entry.name.endsWith('.js') && entry.name !== 'index.js') {
            const filePath = path.join(__dirname, directory, entry.name);
            const relativePath = './' + path.join(directory, entry.name).replace(/\\/g, '/');
            const cardId = extractCardId(filePath);
            if (cardId) {
                cardIdToPath[cardId] = relativePath;
            }
        }
    }
}

// Scan all card directories at module load (reads files but doesn't require them)
const directories = fs
    .readdirSync(__dirname, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

for (const directory of directories) {
    scanDirectory(directory);
}

// Create a Proxy that lazy-loads cards on demand
const cards = new Proxy(loadedCards, {
    get(target, cardId) {
        if (typeof cardId === 'symbol') {
            return undefined;
        }

        // Return from cache if already loaded
        if (target[cardId]) {
            return target[cardId];
        }

        // Load if we have a path for this cardId
        const filePath = cardIdToPath[cardId];
        if (filePath) {
            try {
                const card = require(filePath);
                if (card && card.id) {
                    target[card.id] = card;
                }
                return target[cardId];
            } catch (e) {
                console.error(`Failed to load card ${cardId}:`, e.message);
            }
        }

        return undefined;
    },

    has(target, cardId) {
        if (typeof cardId === 'symbol') {
            return false;
        }
        return cardId in target || cardId in cardIdToPath;
    },

    ownKeys() {
        return Object.keys(cardIdToPath);
    },

    getOwnPropertyDescriptor(target, cardId) {
        if (typeof cardId === 'symbol') {
            return undefined;
        }
        if (cardId in cardIdToPath) {
            return { configurable: true, enumerable: true, writable: true };
        }
        return undefined;
    }
});

module.exports = cards;
