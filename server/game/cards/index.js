const fs = require('fs');
const path = require('path');

// Map of fileKey (filename without .js) -> { filePath, loaded }
const cardRegistry = {};
// Cache of loaded card classes by cardId
const loadedCards = {};
// Map of cardId -> fileKey for direct lookups (built as cards are loaded)
const cardIdToFileKey = {};

/**
 * Convert PascalCase filename to kebab-case card ID (heuristic)
 * e.g., "AncientBear" -> "ancient-bear", "BaitAndSwitch" -> "bait-and-switch"
 */
function filenameToCardId(filename) {
    return filename
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

/**
 * Scan directories to build the card registry (fileKey -> filePath)
 * Also builds a heuristic cardId -> fileKey mapping for fast lookups
 */
function scanDirectory(directory) {
    const fullPath = path.join(__dirname, directory);
    const entries = fs.readdirSync(fullPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            scanDirectory(path.join(directory, entry.name));
        } else if (entry.name.endsWith('.js') && entry.name !== 'index.js') {
            const filePath = './' + path.join(directory, entry.name).replace(/\\/g, '/');
            const fileKey = entry.name.replace('.js', '');
            cardRegistry[fileKey] = { filePath, loaded: false };

            // Build heuristic mapping from likely cardId to fileKey
            const likelyCardId = filenameToCardId(fileKey);
            if (!cardIdToFileKey[likelyCardId]) {
                cardIdToFileKey[likelyCardId] = fileKey;
            }
        }
    }
}

/**
 * Load a card by its file key and register it by its actual card ID
 */
function loadCardByFileKey(fileKey) {
    const entry = cardRegistry[fileKey];
    if (!entry || entry.loaded) {
        return;
    }

    try {
        const card = require(entry.filePath);
        if (card && card.id) {
            loadedCards[card.id] = card;
            // Update the mapping with the actual cardId
            cardIdToFileKey[card.id] = fileKey;
        }
        entry.loaded = true;
    } catch (e) {
        // Mark as loaded to avoid retrying
        entry.loaded = true;
        console.error(`Failed to load card ${fileKey}:`, e.message);
    }
}

/**
 * Preload all cards - call this in production for optimal performance
 */
function preloadAll() {
    for (const fileKey of Object.keys(cardRegistry)) {
        if (!cardRegistry[fileKey].loaded) {
            loadCardByFileKey(fileKey);
        }
    }
}

// Scan all card directories at module load (fast - just file paths)
const directories = fs
    .readdirSync(__dirname, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

for (const directory of directories) {
    scanDirectory(directory);
}

// Track cardIds we've already done a full search for (to avoid repeated scans)
const searchedCardIds = new Set();

// Create a Proxy that lazy-loads cards on demand
const cards = new Proxy(loadedCards, {
    get(target, cardId) {
        // Skip symbols and internal properties
        if (typeof cardId === 'symbol' || cardId === 'preloadAll' || cardId === 'then') {
            if (cardId === 'preloadAll') return preloadAll;
            return undefined;
        }

        // If already loaded, return it
        if (target[cardId]) {
            return target[cardId];
        }

        // If we've already searched for this cardId and didn't find it, don't search again
        if (searchedCardIds.has(cardId)) {
            return undefined;
        }

        // Try the heuristic mapping first (fast path)
        const fileKey = cardIdToFileKey[cardId];
        if (fileKey && cardRegistry[fileKey] && !cardRegistry[fileKey].loaded) {
            loadCardByFileKey(fileKey);
            if (target[cardId]) {
                return target[cardId];
            }
        }

        // Fallback: scan unloaded files to find the card
        // This handles cases where the heuristic mapping was wrong (e.g., BouncingDeathQuark -> bouncing-deathquark)
        for (const fk of Object.keys(cardRegistry)) {
            if (!cardRegistry[fk].loaded) {
                loadCardByFileKey(fk);
                if (target[cardId]) {
                    return target[cardId];
                }
            }
        }

        // Mark this cardId as searched to avoid future full scans
        searchedCardIds.add(cardId);
        return undefined;
    },

    has(target, cardId) {
        if (typeof cardId === 'symbol') {
            return false;
        }
        if (cardId in target) {
            return true;
        }
        // Check if it might exist via heuristic
        return cardIdToFileKey[cardId] !== undefined;
    },

    ownKeys(target) {
        // Need to load all to enumerate
        preloadAll();
        return Object.keys(target);
    },

    getOwnPropertyDescriptor(target, cardId) {
        if (typeof cardId === 'symbol') {
            return undefined;
        }
        const value = cards[cardId];
        if (value !== undefined) {
            return { configurable: true, enumerable: true, value };
        }
        return undefined;
    }
});

// Attach preloadAll to the proxy for production use
cards.preloadAll = preloadAll;

module.exports = cards;
