const mongoskin = require('mongoskin');

class BaseRepository {
    constructor(dbPath) {
        this.db = mongoskin.db(dbPath);
    }

    callCallbackIfPresent(callback, ...params) {
        if(!callback) {
            return;
        }

        callback(...params);
    }
}

module.exports = BaseRepository;
