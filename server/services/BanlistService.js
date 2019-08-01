const logger = require('../log');

class UserService {
    constructor(db, configService) {
        this.banlist = db.get('banlist');
        this.configService = configService;
    }

    async getBanList() {
        return this.banlist.find({})
            .then(banlist => {
                return banlist;
            })
            .catch(err => {
                logger.error('Error fetching banlist', err);

                throw new Error('Error occured fetching banlist');
            });
    }

    async getEntryByIp(ip) {
        return this.banlist.find({ ip: ip })
            .then(banlist => {
                return banlist[0];
            })
            .catch(err => {
                logger.error('Error fetching banlist', err);

                throw new Error('Error occured fetching banlist');
            });
    }

    async addBanlistEntry(entry) {
        return this.banlist.insert(entry)
            .then(() => {
                return entry;
            })
            .catch(err => {
                logger.error('Error adding banlist entry', err, entry);

                throw new Error('Error occured adding banlist entry');
            });
    }
}

module.exports = UserService;
