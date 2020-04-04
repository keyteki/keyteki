const moment = require('moment');
const crypto = require('crypto');
const EventEmitter = require('events');
const uuid = require('uuid');

const logger = require('../log');
const User = require('../models/User');
const db = require('../db');

class UserService extends EventEmitter {
    constructor(_, configService) {
        super();

        this.configService = configService;
    }

    async doesUserExist(username) {
        let rows;

        try {
            rows = await db.query('SELECT 1 FROM "Users" WHERE Lower("Username") = Lower($1)', [username]);
        } catch(err) {
            logger.error('Failed to lookup user', err);
            return null;
        }

        return (rows && rows.length > 0);
    }

    async doesEmailExist(email) {
        let rows;

        try {
            rows = await db.query('SELECT 1 FROM "Users" WHERE Lower("Email") = Lower($1)', [email]);
        } catch(err) {
            logger.error('Failed to lookup email', err);
            return null;
        }

        return (rows && rows.length > 0);
    }

    async getUserByUsername(username) {
        let rows;

        try {
            rows = await db.query('SELECT * FROM "Users" WHERE Lower("Username") = Lower($1)', [username]);
        } catch(err) {
            logger.error('Failed to lookup user', err);
            return null;
        }

        if(rows === null || rows.length === 0) {
            return null;
        }

        return this.getUserFromDbUser(rows[0]);
    }

    async getFullUserByUsername(username) {
        let user = await this.getUserByUsername(username);

        if(!user) {
            return user;
        }

        let tokens;
        try {
            tokens = await db.query('SELECT * FROM "RefreshToken" WHERE "UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup tokens for user', err);
        }

        if(tokens) {
            user.tokens = this.mapTokens(tokens);
        } else {
            user.tokens = [];
        }

        let blockList;
        try {
            blockList = await db.query('SELECT * FROM "BlockList" WHERE "UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup blocklist for user', err);
        }

        if(blockList) {
            user.blockList = blockList.map(bl => bl.Entry);
        } else {
            user.blockList = [];
        }

        let permissions;
        try {
            permissions = await db.query('SELECT r."Name" FROM "UserRoles" ur JOIN "Roles" r ON r."Id" = ur."RoleId" WHERE ur."UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup permissions for user', err);
        }

        if(permissions) {
            user.permissions = this.mapPermissions(permissions);
        } else {
            user.permissions = [];
        }

        return new User(user);
    }

    async getUserByEmail(email) {
        let rows;

        try {
            rows = await db.query('SELECT * FROM "Users" WHERE Lower("Email") = Lower($1)', [email]);
        } catch(err) {
            logger.error('Failed to lookup user', err);
            return null;
        }

        if(rows === null || rows.length === 0) {
            return null;
        }

        return this.getUserFromDbUser(rows[0]);
    }

    async getUserById(id) {
        let rows;

        try {
            rows = await db.query('SELECT * FROM "Users" WHERE "Id" = $1', [id]);
        } catch(err) {
            logger.error('Failed to lookup user', err);
            return null;
        }

        if(rows === null || rows.length === 0) {
            return null;
        }

        let user = this.getUserFromDbUser(rows[0]);

        let tokens;

        try {
            tokens = await db.query('SELECT * FROM "RefreshToken" WHERE "UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup tokens for user', err);
        }

        if(tokens) {
            user.tokens = this.mapTokens(tokens);
        } else {
            user.tokens = [];
        }

        let blockList;
        try {
            blockList = await db.query('SELECT * FROM "BlockList" WHERE "UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup blocklist for user', err);
        }

        if(blockList) {
            user.blockList = blockList.map(bl => bl.Entry);
        } else {
            user.blockList = [];
        }

        let permissions;
        try {
            permissions = await db.query('SELECT r."Name" FROM "UserRoles" ur JOIN "Roles" r ON r."Id" = ur."RoleId" WHERE ur."UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to lookup permissions for user', err);
        }

        if(permissions) {
            user.permissions = this.mapPermissions(permissions);
        } else {
            user.permissions = [];
        }

        return new User(user);
    }

    async getPossiblyLinkedAccounts(user) {
        let users = [];
        try {
            const query = 'SELECT DISTINCT u."Username" FROM "RefreshToken" rt ' +
                            'JOIN "RefreshToken" rt2 ON rt."Ip" = rt2."Ip" ' +
                            'JOIN "Users" u ON u."Id" = rt2."UserId" ' +
                            'WHERE rt."UserId" = $1 and rt2."UserId" != $1';
            users = await db.query(query, [user.id]);
        } catch(err) {
            logger.error('Error finding related ips', err, user.username);
        }

        return users.map(u => ({ username: u.Username }));
    }

    async addUser(user) {
        let ret = await db.query('INSERT INTO "Users" ' +
        '("Username", "Password", "Email", "Registered", "RegisterIp", "Settings_DisableGravatar", "Verified", "ActivationToken", "ActivationTokenExpiry") VALUES ' +
        '($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "Id"',
        [user.username, user.password, user.email, user.registered, user.registerIp, !user.enableGravatar, user.verified, user.activationToken, user.activationTokenExpiry]);

        user.id = ret[0].Id;

        return user;
    }

    async update(user) {
        let query = 'UPDATE "Users" SET "Email"=$1, "Verified"=$2, "Disabled"=$3, "Settings_DisableGravatar"=$4, ' +
            '"Settings_CardSize"=$5, "Settings_Background"=$6, "Settings_OrderAbilities"=$7, "Settings_ConfirmOneClick"=$8, "PatreonToken"=$9 WHERE "Id" = $10';

        try {
            await db.query(query, [user.email, user.verified, user.disabled, !user.enableGravatar, user.settings.cardSize,
                user.settings.background, user.settings.optionSettings.orderForcedAbilities, user.settings.optionSettings.confirmOneClick, JSON.stringify(user.patreon), user.id]);
        } catch(err) {
            logger.error('Failed to update user', err);
        }

        if(user.password && user.password) {
            return this.setPassword(user, user.password);
        }
    }

    async addBlocklistEntry(user, entry) {
        try {
            await db.query('INSERT INTO "BlockList" ("UserId", "Entry") VALUES ($1, $2)', [user.id, entry]);
        } catch(err) {
            logger.warn('Failed to add blocklist entry', err);

            throw new Error('Error adding blocklist entry');
        }
    }

    async deleteBlocklistEntry(user, entry) {
        try {
            await db.query('DELETE FROM "BlockList" WHERE "UserId" = $1 AND "Entry" = $2', [user.id, entry]);
        } catch(err) {
            logger.warn('Failed to remove blocklist entry', err);

            throw new Error('Error removing blocklist entry');
        }
    }

    async setResetToken(user, token, tokenExpiration) {
        try {
            await db.query('UPDATE "Users" SET "ResetToken" = $1, "TokenExpires" = $2 WHERE "Id" = $3',
                [token, tokenExpiration, user.id]);
        } catch(err) {
            logger.error('Failed to set reset token', err);

            throw new Error('Error setting reset token');
        }
    }

    async clearResetToken(user) {
        try {
            await db.query('UPDATE "Users" SET "ResetToken" = NULL, "TokenExpires" = NULL WHERE "Id" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to clear reset token', err);

            throw new Error('Error clearing reset token');
        }
    }

    setPassword(user, password) {
        try {
            return db.query('UPDATE "Users" SET "Password" = $1 WHERE "Id" = $2', [password, user.id]);
        } catch(err) {
            logger.error('Failed to update user password', err);
        }
    }

    async activateUser(user) {
        try {
            await db.query('UPDATE "Users" SET "ActivationToken" = NULL, "ActivationExpiry" = NULL, "Verified" = true WHERE "Id" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to activate user', err);

            throw new Error('Error activating user');
        }
    }

    async clearUserSessions(username) {
        let user = await this.getFullUserByUsername(username);

        if(!user) {
            throw ('User not found');
        }

        try {
            await db.query('DELETE FROM "RefreshToken" WHERE "UserId" = $1', [user.id]);
        } catch(err) {
            logger.error('Failed to clear user sessions', err);
        }
    }

    async addRefreshToken(user, token, ip) {
        let expiration = moment().add(1, 'months');
        let hmac = crypto.createHmac('sha512', this.configService.getValueForSection('lobby', 'hmacSecret'));

        let tokenId = uuid.v1();

        let encodedToken = hmac.update(`REFRESH ${user.username} ${tokenId}`).digest('hex');
        let res = await db.query('INSERT INTO "RefreshToken" ("UserId", "Token", "TokenId", "Expiry", "Ip", "LastUsed") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "Id"',
            [user.id, encodedToken, tokenId, expiration, ip, new Date()]);

        return {
            id: res[0].Id,
            username: user.username,
            token: encodedToken
        };
    }

    verifyRefreshToken(username, refreshToken) {
        let hmac = crypto.createHmac('sha512', this.configService.getValueForSection('lobby', 'hmacSecret'));
        let encodedToken = hmac.update(`REFRESH ${username} ${refreshToken.tokenId}`).digest('hex');

        if(encodedToken !== refreshToken.token) {
            return false;
        }

        let now = moment();
        if(refreshToken.exp < now) {
            return false;
        }

        return true;
    }

    async updateRefreshTokenUsage(tokenId, ip) {
        try {
            await db.query('UPDATE "RefreshToken" SET "Ip" = $1, "LastUsed" = $2 WHERE "TokenId" = $3', [ip, new Date(), tokenId]);
        } catch(err) {
            logger.error('Error saving token usage', err);
        }
    }

    async getRefreshTokenById(userId, tokenId) {
        let tokens;

        try {
            tokens = await db.query('SELECT * FROM "RefreshToken" WHERE "Id" = $1 AND "UserId" = $2', [tokenId, userId]);
        } catch(err) {
            logger.error('Failed to get refresh token by id');
        }

        if(!tokens || tokens.length === 0) {
            return undefined;
        }

        const token = tokens[0];

        return {
            id: token.Id,
            tokenId: token.TokenId,
            expiry: token.Expiry,
            lastUsed: token.LastUsed,
            ip: token.Ip
        };
    }

    async removeRefreshToken(userId, tokenId) {
        try {
            await db.query('DELETE FROM "RefreshToken" WHERE "Id" = $1 AND "UserId" = $2', [tokenId, userId]);
        } catch(err) {
            logger.error('Failed to remove refresh token');
        }
    }

    async setSupporterStatus(userId, isSupporter) {
        let supporterRoles = await db.query('SELECT 1 "UserRoles" ur JOIN "Roles" r ON r."Id" = ur."RoleId" WHERE "UserId" = $1 AND r."Name" = \'Supporter\'',
            [userId]);
        let isExistingSupporter = supporterRoles && supporterRoles.length > 0;

        if(isExistingSupporter && !isSupporter) {
            try {
                await db.query('DELETE FROM "UserRoles" ur USING "Roles" r WHERE r."Id" = ur."RoleId" AND "UserId" = $1 AND r."Name" = ' +
                    '\'Supporter\'', [userId]);
            } catch(err) {
                logger.error('Failed to remove supporter status', err);

                throw new Error('Failed to remove supporter status');
            }
        } else if(!isExistingSupporter && isSupporter) {
            try {
                await db.query('INSERT INTO "UserRoles" ("UserId", "RoleId") VALUES ($1, (SELECT "Id" FROM "Roles" WHERE "Name" = \'Supporter\'',
                    [userId]);
            } catch(err) {
                logger.error('Failed to add supporter status', err);

                throw new Error('Failed to add supporter status');
            }
        }
    }

    async cleanupRefreshTokens() {
        await db.query('DELETE FROM "RefreshToken" WHERE "Expiry" < current_date');
    }

    getUserFromDbUser(dbUser) {
        const user = {
            id: dbUser.Id,
            password: dbUser.Password,
            registered: dbUser.Registered,
            username: dbUser.Username,
            email: dbUser.Email,
            emailHash: dbUser.EmailHash,
            settings: {
                background: dbUser.Settings_Background,
                cardSize: dbUser.Settings_CardSize,
                disableGravatar: dbUser.Settings_DisableGravatar,
                optionSettings: {
                    orderForcedAbilities: dbUser.Settings_OrderAbilities,
                    confirmOneClick: dbUser.Settings_ConfirmOneClick
                }
            },
            verified: dbUser.Verified,
            disabled: dbUser.Disabled,
            patreon: dbUser.PatreonToken && JSON.parse(dbUser.PatreonToken),
            resetToken: dbUser.ResetToken,
            tokenExpires: dbUser.TokenExpires,
            activationToken: dbUser.ActivationToken,
            activationTokenExpiry: dbUser.ActivationTokenExpiry,
            registerIp: dbUser.RegisterIp
        };

        return user;
    }

    mapTokens(dbTokens) {
        return dbTokens.map(token => ({
            id: token.Id,
            token: token.Token,
            expiry: token.Expiry,
            ip: token.Ip,
            tokenId: token.TokenId,
            lastUsed: token.LastUsed
        }));
    }

    mapPermissions(permissions) {
        let ret = {
            canEditNews: false,
            canManageUsers: false,
            canManagePermissions: false,
            canManageGames: false,
            canManageNodes: false,
            canModerateChat: false,
            canVerifyDecks: false,
            canManageBanlist: false,
            canManageMotd: false,
            isAdmin: false,
            isContributor: false,
            isSupporter: false
        };

        for(let permission of permissions) {
            switch(permission.Name) {
                case 'NewsManager':
                    ret.canEditNews = true;
                    break;
                case 'UserManager':
                    ret.canManageUsers = true;
                    break;
                case 'PermissionsManager':
                    ret.canManagePermissions = true;
                    break;
                case 'GameManager':
                    ret.canManageGames = true;
                    break;
                case 'NodeManager':
                    ret.canManageNodes = true;
                    break;
                case 'ChatManager':
                    ret.canModerateChat = true;
                    break;
                case 'DeckVerifier':
                    ret.canVerifyDecks = true;
                    break;
                case 'BanListManager':
                    ret.canManageBanlist = true;
                    break;
                case 'MotdManager':
                    ret.canManageMotd = true;
                    break;
                case 'Admin':
                    ret.isAdmin = true;
                    break;
                case 'Supporter':
                    ret.isSupporter = true;
                    break;
                case 'Contributor':
                    ret.isContributor = true;
                    break;
            }
        }

        return ret;
    }
}

module.exports = UserService;
