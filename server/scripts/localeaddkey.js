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
    { name: 'value', type: String, defaultValue: '' },
    { name: 'after', type: String, defaultValue: '' },
    { name: 'replace', type: String, defaultValue: '' }
];

let options = commandLineArgs(optionsDefinition);

function addKey(localeDir, key, value, after, replace) {
    let languages = ['de', 'en', 'es', 'fr', 'it', 'ko', 'pl', 'pt', 'th', 'zhhans', 'zhhant'];
    let locales = {};

    for (let language of languages) {
        let file = path.join(localeDir, language + '.json');
        locales[language] = JSON.parse(fs.readFileSync(file, 'utf8'));
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

        if (!after && !replace) {
            locale[key] = value ? value : key;
        } else if (after) {
            if (!locale[after]) {
                console.log('key: [' + after + '] does not exist in ' + file + '.');
                return;
            }
            let newLocale = {};
            for (let cur of Object.keys(locale)) {
                newLocale[cur] = locale[cur];
                if (cur === after) {
                    newLocale[key] = value ? value : key;
                }
            }
            locale = newLocale;
        } else if (replace) {
            if (!locale[replace]) {
                console.log('key: [' + after + '] does not exist in ' + file + '.');
                return;
            }
            let newLocale = {};
            for (let cur of Object.keys(locale)) {
                if (cur === replace) {
                    newLocale[key] = value ? value : key === locale[cur] ? key : locale[cur];
                } else {
                    newLocale[cur] = locale[cur];
                }
            }
            locale = newLocale;
        }

        fs.writeFile(file, JSON.stringify(locale, undefined, 4), 'utf8', function (err) {
            if (err) {
                console.log('An error occurred while writing JSON Object to File: ' + file);
                return console.log(err);
            }

            console.log('JSON file ' + file + ' has been saved.');
        });
    }
}

addKey(
    options['locale-dir'],
    options['key'],
    options['value'],
    options['after'],
    options['replace']
);
