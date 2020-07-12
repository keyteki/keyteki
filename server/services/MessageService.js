const EventEmitter = require('events');

const logger = require('../log.js');
const db = require('../db');

class MessageService extends EventEmitter {
    async addMessage(message, user) {
        let ret;
        let id;
        try {
            ret = await db.query(
                'INSERT INTO "Messages" ("Text", "PostedTime", "PosterId") VALUES ($1, $2, $3) RETURNING "Id"',
                [message.message, message.time, user.id]
            );
        } catch (err) {
            logger.error('Unable to insert message', err);
            throw new Error('Unable to insert message');
        }

        id = ret[0].Id;
        message.id = id;

        return message;
    }

    async getLastMessagesForUser(user) {
        let messages;

        try {
            messages = await db.query(
                'SELECT m.*, u."Username" AS "Poster", r."Name" AS "Role", ud."Username" AS "DeletedBy", u."Settings_Avatar" AS "Avatar" FROM "Messages" m ' +
                    'JOIN "Users" u ON u."Id" = m."PosterId" ' +
                    'LEFT JOIN "UserRoles" ur ON ur."UserId" = u."Id" ' +
                    'LEFT JOIN "Roles" r ON r."Id" = ur."RoleId" ' +
                    'LEFT JOIN "Users" ud ON ud."Id" = m."DeletedById" ' +
                    "WHERE r.\"Name\" IS NULL OR r.\"Name\" IN ('Admin', 'Supporter', 'Contributor', 'TournamentWinner', 'PreviousTournamentWinner') " +
                    'ORDER BY "PostedTime" DESC ' +
                    'LIMIT 100'
            );
        } catch (err) {
            logger.error('Unable to fetch messages', err);
            throw new Error('Unable to fetch messages');
        }

        return messages.map((m) => this.mapMessage(m, user));
    }

    async removeMessage(messageId, user) {
        try {
            await db.query(
                'UPDATE "Messages" SET "Deleted" = $1, "DeletedById" = $2 WHERE "Id" = $3',
                [new Date(), user.id, messageId]
            );
        } catch (err) {
            logger.error('Failed to remove message', err);
            throw new Error('Failed to remove message');
        }

        this.emit('messageDeleted', messageId, user);
    }

    async getMotdMessage() {
        let motd;

        try {
            motd = await db.query('SELECT * FROM "Motd" ORDER BY "PostedTime" DESC LIMIT 1');
            if (!motd || motd.length === 0) {
                return undefined;
            }

            motd = motd[0];
        } catch (err) {
            logger.error('Unable to fetch motd', err);
            throw new Error('Unable to fetch motd');
        }

        return {
            id: motd.Id,
            message: motd.Text,
            motdType: motd.Type
        };
    }

    async setMotdMessage(message, user) {
        await db.query(
            'INSERT INTO "Motd" ("PosterId", "Text", "Type", "PostedTime") VALUES ($1, $2, $3, $4)',
            [user.id, message.message, message.motdType, new Date()]
        );
    }

    mapRole(role) {
        switch (role) {
            case 'Admin':
                return 'admin';
            case 'Supporter':
                return 'supporter';
            case 'Contributor':
                return 'contributor';
            case 'TournamentWinner':
                return 'winner';
            case 'PreviousTournamentWinner':
                return 'previouswinner';
        }
    }

    mapMessage(message, user) {
        let retMessage = {
            id: message.Id,
            message:
                !message.Deleted || (user && user.permissions.canModerateChat)
                    ? message.Text
                    : undefined,
            deleted: !!message.Deleted,
            time: message.PostedTime,
            user: {
                avatar: message.Avatar,
                username: message.Poster,
                name: message.Poster,
                role: this.mapRole(message.Role)
            }
        };

        if (user && user.permissions.canModerateChat) {
            retMessage.deletedBy = message.DeletedBy;
        }

        return retMessage;
    }
}

module.exports = MessageService;
