import passport from 'passport';

import UserService from '../services/UserService.js';
import DeckService from '../services/DeckService.js';
import ConfigService from '../services/ConfigService.js';
import { wrapAsync } from '../util.js';
import logger from '../log.js';
import CardService from '../services/CardService.js';

let configService = new ConfigService();

let userService = new UserService(configService);
let cardService = new CardService(configService);
let deckService = new DeckService(configService, cardService);

export function init(server) {
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

                // @ts-ignore runtime user has getFullDetails
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

            // @ts-ignore runtime dbUser has getDetails
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
}
