const logger = require('../log.js');

const PatreonTokenUrl = 'https://www.patreon.com/api/oauth2/token';
const PatreonIdentityUrl = 'https://www.patreon.com/api/oauth2/v2/identity';

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.clientId = clientId;
        this.secret = secret;
        this.userService = userService;
        this.callbackUrl = callbackUrl;
    }

    async getPatreonStatusForUser(user) {
        // Without the identity.memberships scope, v2 only returns the user's membership to our own campaign
        const params = new URLSearchParams({
            include: 'memberships',
            'fields[member]': 'patron_status'
        });

        let response;
        try {
            response = await this.request(`${PatreonIdentityUrl}?${params.toString()}`, {
                headers: { Authorization: `Bearer ${user.patreon.access_token}` }
            });
        } catch (err) {
            logger.error('Error getting patreon status for %s: %s', user.username, err.message);

            return 'none';
        }

        const memberships = (response.included || []).filter((item) => item.type === 'member');

        if (memberships.some((member) => member.attributes.patron_status === 'active_patron')) {
            return 'pledged';
        }

        return 'linked';
    }

    async refreshTokenForUser(user) {
        let response;
        try {
            response = await this.requestToken({
                grant_type: 'refresh_token',
                refresh_token: user.patreon.refresh_token
            });
        } catch (err) {
            logger.error('Error refreshing patreon account %s', err.message);
            return undefined;
        }

        const userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = response;

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    async linkAccount(username, code) {
        let response;
        try {
            response = await this.requestToken({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.callbackUrl
            });
        } catch (err) {
            logger.error('Error linking patreon account %s', err.message);
            return false;
        }

        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        user.patreon = response;

        try {
            const password = user.password;

            user.password = undefined;
            await this.userService.update(user);

            user.password = password;
        } catch (err) {
            logger.error(err);
            return false;
        }

        return user;
    }

    async unlinkAccount(username) {
        const user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return true;
    }

    async requestToken(params) {
        const response = await this.request(PatreonTokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                ...params,
                client_id: this.clientId,
                client_secret: this.secret
            }).toString()
        });

        response.date = new Date();

        return response;
    }

    async request(url, options) {
        const response = await fetch(url, {
            ...options,
            headers: { 'User-Agent': 'Keyteki', ...options.headers }
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        return response.json();
    }
}

module.exports = PatreonService;
