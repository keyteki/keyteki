import passport from 'passport';
import { randomUUID } from 'node:crypto';
import ConfigService from '../services/ConfigService.js';
import DeckService from '../services/DeckService.js';
import { wrapAsync } from '../util.js';
import logger from '../log.js';
import ServiceFactory from '../services/ServiceFactory.js';
const configService = new ConfigService();
const cardService = ServiceFactory.cardService(configService);

const deckService = new DeckService(configService, cardService);

export const init = function (server) {
    server.get(
        '/api/standalone-decks',
        wrapAsync(async function (req, res) {
            let decks;

            try {
                decks = await deckService.getStandaloneDecks();
            } catch (err) {
                logger.error('Failed to get standalone decks', err);

                throw new Error('Failed to get standalone decks');
            }

            res.send({ success: true, decks: decks });
        })
    );

    server.get(
        '/api/decks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.params.id || req.params.id === '') {
                return res.status(404).send({ message: 'No such deck' });
            }

            let deck = await deckService.getById(req.params.id);

            if (!deck) {
                return res.status(404).send({ message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            res.send({ success: true, deck: deck });
        })
    );

    server.get(
        '/api/decks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let numDecks = await deckService.getNumDecksForUser(req.user, req.query);
            let decks = [];

            if (numDecks > 0) {
                decks = (await deckService.findForUser(req.user, req.query)).map((deck) => {
                    let deckUsageLevel = 0;
                    if (
                        deck.usageCount >
                        configService.getValueForSection('lobby', 'lowerDeckThreshold')
                    ) {
                        deckUsageLevel = 1;
                    }

                    if (
                        deck.usageCount >
                        configService.getValueForSection('lobby', 'middleDeckThreshold')
                    ) {
                        deckUsageLevel = 2;
                    }

                    if (
                        deck.usageCount >
                        configService.getValueForSection('lobby', 'upperDeckThreshold')
                    ) {
                        deckUsageLevel = 3;
                    }

                    deck.usageLevel = deckUsageLevel;
                    deck.usageCount = undefined;

                    return deck;
                });
            }

            res.send({ success: true, numDecks: numDecks, decks: decks });
        })
    );

    server.post(
        '/api/decks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.body.uuid) {
                return res.send({ success: false, message: 'uuid must be specified' });
            }

            let deck = Object.assign({}, { uuid: req.body.uuid, username: req.user.username });
            let createResult;

            try {
                createResult = await deckService.create(req.user, deck);
            } catch (error) {
                logger.error('Failed to import deck', error);

                return res.send({
                    success: false,
                    message:
                        'An error occurred importing your deck.  Please check the Url or try again later.'
                });
            }

            if (!createResult || !createResult.success) {
                return res.send({
                    success: false,
                    message:
                        createResult && createResult.message
                            ? createResult.message
                            : 'An error occurred importing your deck.  Please check the Url or try again later.'
                });
            }

            res.send({ success: true, deck: createResult.deck });
        })
    );

    server.post(
        '/api/decks/alliance',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.body.name) {
                return res.send({ success: false, message: 'name must be specified' });
            }

            if (!req.body.pods) {
                return res.send({ success: false, message: 'pods must be specified' });
            }

            let deck = Object.assign(
                {},
                {
                    name: req.body.name,
                    uuid: randomUUID(),
                    username: req.user.username,
                    pods: req.body.pods,
                    tokenCard: req.body.token,
                    tokenSourceDeck: req.body.tokenSourceDeck,
                    prophecySourceDeck: req.body.prophecySourceDeck
                }
            );
            let savedDeck;

            try {
                savedDeck = await deckService.createAlliance(req.user, deck);
            } catch (error) {
                return res.send({
                    success: false,
                    message: error.message
                });
            }

            if (!savedDeck) {
                return res.send({
                    success: false,
                    message:
                        'An error occurred importing your deck.  Please check the Url or try again later.'
                });
            }

            res.send({ success: true, deck: savedDeck });
        })
    );

    server.delete(
        '/api/decks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let id = req.params.id;

            let deck = await deckService.getById(id);

            if (!deck) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            await deckService.delete(id);
            res.send({ success: true, message: 'Deck deleted successfully', deckId: id });
        })
    );

    server.post(
        '/api/decks/bulk-delete',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const deckIds = Array.isArray(req.body.deckIds)
                ? req.body.deckIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id))
                : [];

            if (deckIds.length === 0) {
                return res.status(400).send({
                    success: false,
                    message: 'deckIds must be a non-empty array'
                });
            }

            const ownershipCheck = await deckService.checkDeckOwnershipForUser(
                req.user.id,
                deckIds
            );
            if (!ownershipCheck.allExist) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            if (!ownershipCheck.allOwned) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            await deckService.deleteMany(deckIds);

            res.send({
                success: true,
                message: 'Decks deleted successfully',
                deckIds: deckIds
            });
        })
    );

    server.post(
        '/api/decks/:id/verify',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canVerifyDecks) {
                return res.status(403);
            }

            let id = req.params.id;

            let deck = await deckService.getById(id);

            if (!deck) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            deck.verified = true;
            deck.id = id;

            await deckService.update(deck);
            res.send({ success: true, message: 'Deck verified successfully', deckId: id });
        })
    );

    server.post(
        '/api/decks/:id/refresh-accolades',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let id = req.params.id;

            let deck = await deckService.getById(id);

            if (!deck) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            try {
                const accolades = await deckService.refreshAccolades(id, req.user);
                res.send({ success: true, accolades: accolades });
            } catch (error) {
                logger.error('Failed to refresh accolades', error);
                return res.send({
                    success: false,
                    message: error.message || 'Failed to refresh accolades'
                });
            }
        })
    );

    server.post(
        '/api/decks/:id/accolades/:accoladeId/shown',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let id = req.params.id;
            let accoladeId = req.params.accoladeId;
            let shown = req.body.shown === true;

            let deck = await deckService.getById(id);

            if (!deck) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            try {
                await deckService.updateAccoladeShown(id, accoladeId, shown, req.user);
                res.send({ success: true });
            } catch (error) {
                logger.error('Failed to update accolade shown status', error);
                return res.send({
                    success: false,
                    message: error.message || 'Failed to update accolade shown status'
                });
            }
        })
    );
};
