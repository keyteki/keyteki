const monk = require('monk');
const config = require('config');
const DeckService = require('../services/DeckService.js');
const {wrapAsync} = require('../util.js');

let db = monk(config.dbPath);
let deckService = new DeckService(db);

module.exports.init = function(server) {
    server.get('/api/decks/:id', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.params.id || req.params.id === '') {
            return res.status(404).send({ message: 'No such deck' });
        }

        let deck = await deckService.getById(req.params.id);

        if(!deck) {
            return res.status(404).send({ message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        res.send({ success: true, deck: deck });
    }));

    server.get('/api/decks', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let decks = await deckService.findByUserName(req.user.username);
        res.send({ success: true, decks: decks });
    }));

    server.put('/api/decks/:id', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let deck = await deckService.getById(req.params.id);

        if(!deck) {
            return res.status(404).send({ message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let data = Object.assign({ id: req.params.id }, JSON.parse(req.body.data));

        deckService.update(data);

        res.send({ success: true, message: 'Saved' });
    }));

    server.post('/api/decks', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let deck = Object.assign(JSON.parse(req.body.data), { username: req.user.username });
        await deckService.create(deck);
        res.send({ success: true });
    }));

    server.delete('/api/decks/:id', wrapAsync(async function(req, res) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let id = req.params.id;

        let deck = await deckService.getById(id);

        if(!deck) {
            return res.status(404).send({ success: false, message: 'No such deck' });
        }

        if(deck.username !== req.user.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        await deckService.delete(id);
        res.send({ success: true, message: 'Deck deleted successfully', deckId: id });
    }));
};
