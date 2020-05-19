const passport = require('passport');

const UserService = require('../services/UserService.js');
const DeckService = require('../services/DeckService.js');
const ConfigService = require('../services/ConfigService.js');
const { wrapAsync } = require('../util.js');
const logger = require('../log.js');

let configService = new ConfigService();

let userService = new UserService(configService);
let deckService = new DeckService(configService);

module.exports.init = function (server) {
    server.get(
        '/api/user/:username',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageUsers) {
                return res.status(403);
            }

            let user;
            let linkedAccounts;
            let retUser;
            try {
                user = await userService.getFullUserByUsername(req.params.username);

                if (!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                retUser = user.getFullDetails();

                if (req.user.permissions.canVerifyDecks) {
                    retUser.invalidDecks = (
                        await deckService.getFlaggedUnverifiedDecksForUser(user)
                    ).map((deck) => {
                        return { id: deck.id, uuid: deck.uuid, name: deck.name };
                    });
                }

                linkedAccounts = await userService.getPossiblyLinkedAccounts(user);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occurred searching the user.  Please try again later.'
                });
            }

            res.send({
                success: true,
                user: retUser,
                linkedAccounts:
                    linkedAccounts &&
                    linkedAccounts
                        .map((account) => account.username)
                        .filter((name) => name !== user.username)
            });
        })
    );

    server.put(
        '/api/user/:username',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageUsers) {
                return res.status(403);
            }

            if (!req.body.userToChange) {
                return res.send({ success: false, message: 'You must specify the user data' });
            }

            let userToSet = req.body.userToChange;
            let dbUser;

            try {
                dbUser = await userService.getFullUserByUsername(req.params.username);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occured saving the user.  Please try again later.'
                });
            }

            let user = dbUser.getDetails();

            if (!user) {
                return res.status(404).send({ message: 'Not found' });
            }

            if (req.user.permissions.canManagePermissions) {
                user.permissions = userToSet.permissions;
            }

            user.verified = userToSet.verified;
            user.disabled = userToSet.disabled;

            try {
                await userService.update(user);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occured saving the user.  Please try again later.'
                });
            }

            res.send({ success: true });
        })
    );

    server.post(
        '/api/user/:username/verifyDecks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canVerifyDecks) {
                return res.status(403);
            }

            let user;
            try {
                user = await userService.getFullUserByUsername(req.params.username);

                if (!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                await deckService.verifyDecksForUser(user.id);
            } catch (error) {
                logger.error(error);

                return res.send({
                    success: false,
                    message: 'An error occurred verifying decks.  Please try again later.'
                });
            }

            res.send({ success: true });
        })
    );
};
