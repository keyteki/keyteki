const passport = require('passport');
const ConfigService = require('../services/ConfigService');
const TagService = require('../services/TagService');
const { wrapAsync } = require('../util.js');
const logger = require('../log.js');

const configService = new ConfigService();
const tagService = new TagService(configService);

module.exports.init = function (server) {
    // Get all tags for the authenticated user
    server.get(
        '/api/tags',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                const tags = await tagService.getTagsForUser(req.user);
                res.send({ success: true, tags: tags });
            } catch (err) {
                logger.error('Failed to get user tags', err);
                res.status(500).send({
                    success: false,
                    message: err.message || 'Failed to get tags'
                });
            }
        })
    );

    // Create a new tag
    server.post(
        '/api/tags',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                logger.info('Creating tag with request body:', req.body);

                if (!req.body.name || req.body.name.trim() === '') {
                    return res.status(400).send({
                        success: false,
                        message: 'Tag name is required'
                    });
                }

                if (req.body.name.length > 50) {
                    return res.status(400).send({
                        success: false,
                        message: 'Tag name cannot exceed 50 characters'
                    });
                }

                const tagData = {
                    name: req.body.name.trim(),
                    color: req.body.color || '#007bff'
                };

                logger.info('Tag data to be created:', tagData);
                const tag = await tagService.createTag(req.user, tagData);
                logger.info('Tag created successfully:', tag);
                res.send({ success: true, tag: tag });
            } catch (err) {
                logger.error('Failed to create tag', err);

                if (
                    err.message === 'User cannot have more than 10 tags' ||
                    err.message === 'Tag name already exists'
                ) {
                    return res.status(400).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to create tag'
                });
            }
        })
    );

    // Update a tag
    server.put(
        '/api/tags/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                if (!req.params.id) {
                    return res.status(400).send({
                        success: false,
                        message: 'Tag ID is required'
                    });
                }

                if (req.body.name !== undefined) {
                    if (!req.body.name || req.body.name.trim() === '') {
                        return res.status(400).send({
                            success: false,
                            message: 'Tag name is required'
                        });
                    }

                    if (req.body.name.length > 50) {
                        return res.status(400).send({
                            success: false,
                            message: 'Tag name cannot exceed 50 characters'
                        });
                    }
                }

                const tagData = {};
                if (req.body.name !== undefined) tagData.name = req.body.name.trim();
                if (req.body.color !== undefined) tagData.color = req.body.color;

                const tag = await tagService.updateTag(req.user, parseInt(req.params.id), tagData);
                res.send({ success: true, tag: tag });
            } catch (err) {
                logger.error('Failed to update tag', err);

                if (err.message === 'Tag not found') {
                    return res.status(404).send({
                        success: false,
                        message: err.message
                    });
                }

                if (err.message === 'Tag name already exists') {
                    return res.status(400).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to update tag'
                });
            }
        })
    );

    // Delete a tag
    server.delete(
        '/api/tags/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                if (!req.params.id) {
                    return res.status(400).send({
                        success: false,
                        message: 'Tag ID is required'
                    });
                }

                await tagService.deleteTag(req.user, parseInt(req.params.id));
                res.send({ success: true, tagId: parseInt(req.params.id) });
            } catch (err) {
                logger.error('Failed to delete tag', err);

                if (err.message === 'Tag not found') {
                    return res.status(404).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to delete tag'
                });
            }
        })
    );

    // Get tags for a specific deck
    server.get(
        '/api/decks/:id/tags',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                if (!req.params.id) {
                    return res.status(400).send({
                        success: false,
                        message: 'Deck ID is required'
                    });
                }

                const tags = await tagService.getTagsForDeck(req.user, parseInt(req.params.id));
                res.send({ success: true, tags: tags });
            } catch (err) {
                logger.error('Failed to get deck tags', err);

                if (err.message === 'Deck not found') {
                    return res.status(404).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to get deck tags'
                });
            }
        })
    );

    // Assign a tag to a deck
    server.post(
        '/api/decks/:deckId/tags/:tagId',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                if (!req.params.deckId || !req.params.tagId) {
                    return res.status(400).send({
                        success: false,
                        message: 'Deck ID and Tag ID are required'
                    });
                }

                const assignment = await tagService.assignTagToDeck(
                    req.user,
                    parseInt(req.params.deckId),
                    parseInt(req.params.tagId)
                );
                res.send({ success: true, assignment: assignment });
            } catch (err) {
                logger.error('Failed to assign tag to deck', err);

                if (err.message === 'Deck not found' || err.message === 'Tag not found') {
                    return res.status(404).send({
                        success: false,
                        message: err.message
                    });
                }

                if (err.message === 'Deck cannot have more than 10 tags') {
                    return res.status(400).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to assign tag to deck'
                });
            }
        })
    );

    // Remove a tag from a deck
    server.delete(
        '/api/decks/:deckId/tags/:tagId',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            try {
                if (!req.params.deckId || !req.params.tagId) {
                    return res.status(400).send({
                        success: false,
                        message: 'Deck ID and Tag ID are required'
                    });
                }

                await tagService.removeTagFromDeck(
                    req.user,
                    parseInt(req.params.deckId),
                    parseInt(req.params.tagId)
                );
                res.send({ success: true });
            } catch (err) {
                logger.error('Failed to remove tag from deck', err);

                if (err.message === 'Deck not found') {
                    return res.status(404).send({
                        success: false,
                        message: err.message
                    });
                }

                res.status(500).send({
                    success: false,
                    message: 'Failed to remove tag from deck'
                });
            }
        })
    );
};
