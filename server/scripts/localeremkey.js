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
    { name: 'key', type: String }
];

const options = commandLineArgs(optionsDefinition);

function addKey(localeDir, key) {
    const languages = ['de', 'en', 'es', 'fr', 'it', 'ko', 'pl', 'pt', 'th', 'zhhans', 'zhhant'];
    const locales = {};

    for (const language of languages) {
        const file = path.join(localeDir, language + '.json');
        locales[language] = JSON.parse(fs.readFileSync(file));
        for (const localeKey of Object.keys(locales[language])) {
            if (localeKey !== key && localeKey.toLowerCase() === key.toLowerCase()) {
                console.log('key: [' + key + '] exists in file ' + file + ' with different case.');
            }
        }
    }

    for (const language of languages) {
        const file = path.join(localeDir, language + '.json');
        const locale = locales[language];
        delete locale[key];

        fs.writeFile(file, JSON.stringify(locale, undefined, 4), 'utf8', function (err) {
            if (err) {
                console.log('An error occurred while writing JSON Object to File: ' + file);
                return console.log(err);
            }

            console.log('JSON file ' + file + ' has been saved.');
        });
    }
}

addKey(options['locale-dir'], options['key']);
