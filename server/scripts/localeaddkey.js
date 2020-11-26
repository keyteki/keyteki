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
    { name: 'key', type: String },
    { name: 'value', type: String, defaultValue: '' }
];

let options = commandLineArgs(optionsDefinition);

function addKey(localeDir, key, value) {
    let languages = ['de', 'en', 'es', 'fr', 'it', 'ko', 'pl', 'pt', 'th', 'zhhans', 'zhhant'];
    let locales = {};

    for (let language of languages) {
        let file = path.join(localeDir, language + '.json');
        locales[language] = JSON.parse(fs.readFileSync(file));
        for (let localeKey of Object.keys(locales[language])) {
            if (localeKey === key) {
                console.log(
                    'key: [' + key + '] already exists in file ' + file + '. Verify consistency'
                );
                return;
            }

            if (localeKey.toLowerCase() === key.toLowerCase()) {
                console.log('key: [' + key + '] exists in file ' + file + ' with different case.');
                return;
            }
        }
    }

    for (let language of languages) {
        let file = path.join(localeDir, language + '.json');
        let locale = locales[language];
        locale[key] = value ? value : key;

        fs.writeFile(file, JSON.stringify(locale, undefined, 4), 'utf8', function (err) {
            if (err) {
                console.log('An error occured while writing JSON Object to File: ' + file);
                return console.log(err);
            }

            console.log('JSON file ' + file + ' has been saved.');
        });
    }
}

addKey(options['locale-dir'], options['key'], options['value']);
