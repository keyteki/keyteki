const patreon = require('patreon');
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const pledgeSchema = require('patreon/dist/schemas/pledge').default;

const logger = require('../log.js');

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.userService = userService;
        this.callbackUrl = callbackUrl;

        this.patreonOAuthClient = patreonOAuth(clientId, secret);
    }

    async getPatreonStatusForUser(user) {
        let response;
        let patreonApiClient = patreonAPI(user.patreon.access_token);

        try {
            response = await patreonApiClient('/current_user', {
                fields: {
                    pledge: [...pledgeSchema.default_attributes, pledgeSchema.attributes.declined_since, pledgeSchema.attributes.created_at]
                }
            });
        } catch(err) {
            logger.error(err);

            return 'none';
        }

        let { id } = response.rawJson.data;
        let pUser = response.store.find('user', id);

        if(!pUser || !pUser.pledges || pUser.pledges.length === 0) {
            return 'linked';
        }

        return 'pledged';
    }

    async refreshTokenForUser(user) {
        let response;
        try {
            response = await this.patreonOAuthClient.refreshToken(user.patreon.refresh_token);
        } catch(err) {
            logger.error('Error refreshing patreon account', err);
            return undefined;
        }

        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;

        try {
            await this.userService.update(userDetails);
        } catch(err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    async linkAccount(username, code) {
        let response;
        try {
            response = await this.patreonOAuthClient.getTokens(code, this.callbackUrl);
        } catch(err) {
            logger.error('Error linking patreon account', err);
            return false;
        }

        response.date = new Date();

        let user = await this.userService.getUserByUsername(username);
        if(!user) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        user.patreon = response;

        try {
            let password = user.password;

            user.password = undefined;
            await this.userService.update(user);

            user.password = password;
        } catch(err) {
            logger.error(err);
            return false;
        }

        return user;
    }

    async unlinkAccount(username) {
        let user = await this.userService.getUserByUsername(username);
        if(!user) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch(err) {
            logger.error(err);
            return false;
        }

        return true;
    }
}

module.exports = PatreonService;
