/*eslint no-console:0 */
const monk = require('monk');
const _ = require('underscore');
const fs = require('fs');
const { exec } = require('child_process');
const request = require('request');
const crypto = require('crypto');

let db = monk('mongodb://127.0.0.1:27017/keyforge');

let dbUsers = db.get('users');

function writeFile(path, data, opts = 'utf8') {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, opts, (err) => {
            if(err) {
                return reject(err);
            }

            resolve();
        });
    });
}

async function downloadAvatar() {
    let emailHash = crypto.randomBytes(32).toString('hex');
    let avatar = await httpRequest(`https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=24`, { encoding: null });
    await writeFile('default.png', avatar, 'binary');
}

function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        request(url, options, (err, res, body) => {
            if(err) {
                return reject(err);
            }

            resolve(body);
        });
    });
}

const getProfilePics = async () => {
    await downloadAvatar();

    let count = await dbUsers.count({});
    console.info(count, 'users to process');
    let numberProcessed = 0;
    let chunkSize = 5000;

    while(numberProcessed < count) {
        let users = await dbUsers.find({}, { limit: chunkSize, skip: numberProcessed });
        console.info('loaded', _.size(users), 'users');
        for(let user of users) {
            exec(`cp default.png ${user.username}.png`);
        }

        numberProcessed += _.size(users);
        console.info('processed', numberProcessed, 'users');
    }

    db.close();
};

getProfilePics();