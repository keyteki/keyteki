/**
 * Helpers shared by the converters that build pack files from external card sources.
 */

const ValidKeywords = [
    'elusive',
    'skirmish',
    'taunt',
    'deploy',
    'alpha',
    'omega',
    'hazardous',
    'assault',
    'poison',
    'splash-attack',
    'treachery',
    'versatile',
    'entrench'
];

/**
 * Pulls the printed keywords (e.g. "elusive", "assault:2") out of a card's text.
 * @param {string} text
 * @returns {string[]}
 */
function parseKeywords(text) {
    let potentialKeywords = [];

    for (const line of (text || '').split(/[\n\r\v]/)) {
        potentialKeywords = potentialKeywords.concat(
            line.split('.').map((k) => k.toLowerCase().trim().replace(' ', ':'))
        );
    }

    return potentialKeywords.filter((potentialKeyword) =>
        ValidKeywords.some((keyword) => potentialKeyword.indexOf(keyword) === 0)
    );
}

/**
 * Parses a power, armor or amber value from Master Vault, which may be a number, a numeric
 * string, an empty string or null.
 * @param {number | string | null | undefined} value
 * @returns {number | null}
 */
function parseStat(value) {
    const parsed = parseInt(value);

    return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Sorts a card's locales by language code so pack files diff cleanly.
 * @param {Record<string, { name: string }>} locale
 */
function sortLocales(locale) {
    return Object.keys(locale)
        .sort()
        .reduce((sorted, language) => {
            sorted[language] = locale[language];
            return sorted;
        }, {});
}

/**
 * Fetches JSON from a url. Failed requests reject with an error carrying the status code and
 * response body, so callers can back off when throttled.
 * @param {string} url
 * @param {{ headers?: Record<string, string> }} [options]
 */
async function httpRequest(url, options = {}) {
    const response = await fetch(url, { headers: options.headers });
    if (!response.ok) {
        const err = new Error(`Request failed: ${response.status}`);
        err.statusCode = response.status;
        err.res = {
            statusCode: response.status,
            body: await response.json().catch(() => ({}))
        };

        throw err;
    }

    return response.json();
}

/**
 * Writes a pack file, formatted the same way as the rest of the repository.
 * @param {string} file
 * @param {any} pack
 */
function writePack(file, pack) {
    const fs = require('fs');
    const prettier = require('prettier');
    const options = prettier.resolveConfig.sync(file) || {};

    fs.writeFileSync(
        file,
        prettier.format(JSON.stringify(pack, null, 4), { ...options, filepath: file })
    );
}

module.exports = { ValidKeywords, httpRequest, parseKeywords, parseStat, sortLocales, writePack };
