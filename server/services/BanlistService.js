const logger = require('../log');
const db = require('../db');

class UserService {
    constructor(_, configService) {
        this.configService = configService;
        this.banlist = undefined;
    }

    async getBanList() {
        let banList;

        try {
            banList = await db.query('SELECT bl."Id", bl."Ip", u."Username", bl."Added" FROM "BanList" bl JOIN "Users" u ON u."Id" = bl."CreatorId"');
        } catch(err) {
            logger.error('Error fetching banlist', err);

            throw new Error('Error occured fetching banlist');
        }

        return banList.map(be => this.mapBanList(be));
    }

    mapBanList(banListEntry) {
        return {
            id: banListEntry.Id,
            ip: banListEntry.Ip,
            user: banListEntry.Username,
            added: banListEntry.Added
        };
    }

    async getEntryByIp(ip) {
        let entry;

        try {
            entry = await db.query('SELECT bl."Id", bl."Ip", u."Username", bl."Added" FROM "BanList" bl JOIN "Users" u ON u."Id" = bl."CreatorId" WHERE bl."Ip" = $1', [ip]);
        } catch(err) {
            logger.error('Error fetching banlist entry', err);

            throw new Error('Error occured fetching banlist entry');
        }

        if(!entry || entry.length === 0) {
            return undefined;
        }

        return this.mapBanList(entry[0]);
    }

    async addBanlistEntry(entry) {
        let added = new Date();
        let res;

        try {
            res = await db.query('INSERT INTO "BanList" ("Ip", "CreatorId", "Added") VALUES ($1, $2, $3) RETURNING "Id"', [entry.ip, entry.userId, added]);
        } catch(err) {
            logger.error('Error adding banlist entry', err, entry);

            throw new Error('Error occured adding banlist entry');
        }

        return {
            id: res[0],
            ip: entry.ip,
            added: added
        };
    }
}

module.exports = UserService;
