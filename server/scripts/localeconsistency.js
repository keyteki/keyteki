/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');

const optionsDefinition = [
    {
        name: 'locale-dir',
        type: String,
        defaultValue: path.join(__dirname, '..', '..', 'public', 'locales')
    },
    { name: 'language', type: String },
    { name: 'source', type: String, defaultValue: 'en' },
    { name: 'verbose', type: String, defaultValue: '1' }
];

let options = commandLineArgs(optionsDefinition);

function verifyLocale(localeDir, sourceLanguage, targetLanguage) {
    let sourceLanguageFile = path.join(localeDir, sourceLanguage + '.json');
    let targetLanguageFile = path.join(localeDir, targetLanguage.replace('-', '') + '.json');

    let sourceLocale = JSON.parse(fs.readFileSync(sourceLanguageFile));
    let targetLocale = JSON.parse(fs.readFileSync(targetLanguageFile));

    let sourceLocaleKeys = Object.keys(sourceLocale);
    let targetLocaleKeys = Object.keys(targetLocale);

    let sourceLocaleLength = sourceLocaleKeys.length;
    let targetLocaleLength = targetLocaleKeys.length;

    let uniqueKeys = [];
    let uniqueKeysLower = [];

    for (let key of targetLocaleKeys) {
        if (uniqueKeys.includes(key)) {
            console.log(targetLanguage + ' locale contains duplicate key: ' + key);
        }

        uniqueKeys.push(key);

        if (uniqueKeysLower.includes(key.toLowerCase())) {
            console.log(targetLanguage + ' locale contains key with different case: ' + key);
        }

        uniqueKeysLower.push(key.toLowerCase());
    }

    let consistent = true;

    // Check locales sizing
    if (sourceLocaleLength !== targetLocaleLength) {
        console.log(
            '>> Some keys are missing. ' +
                sourceLanguage +
                ' has ' +
                sourceLocaleLength +
                ' entries, while ' +
                targetLanguage +
                ' has ' +
                targetLocaleLength +
                ' entries.'
        );

        consistent = false;
    }

    // Check source keys not in target
    let missingKeys = sourceLocaleKeys.filter((value) => !targetLocaleKeys.includes(value));
    if (missingKeys.length !== 0) {
        console.log('>> There are ' + missingKeys.length + ' missing keys in ' + targetLanguage);

        if (options['verbose'] === '1') {
            for (let key of missingKeys) {
                console.log('    "' + key + '": "' + sourceLocale[key] + '",');
            }
        }

        consistent = false;
    }

    // A target key not in source
    let extraKeys = targetLocaleKeys.filter((value) => !sourceLocaleKeys.includes(value));
    if (extraKeys.length !== 0) {
        console.log('>> There are ' + extraKeys.length + ' extra keys in ' + targetLanguage);
        if (options['verbose'] === '1') {
            console.log(extraKeys);
        }

        consistent = false;
    }

    if (consistent) {
        console.log(sourceLanguage + ' and ' + targetLanguage + ' files are consistent.');
    }

    if (options['verbose'] === '2') {
        for (let key of sourceLocaleKeys) {
            if (sourceLocale[key] === targetLocale[key]) {
                console.log(
                    'W: value for key [' + key + '] are equal, confirm: ' + sourceLocale[key]
                );
            }
        }
    }
}

verifyLocale(options['locale-dir'], options['source'], options['language']);
