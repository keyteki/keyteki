const logger = require('../log.js');
const request = require('request');

class DeckService {
    constructor(db) {
        this.decks = db.get('decks');
    }

    getById(id) {
        return this.decks.findOne({ _id: id })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + id);
            });
    }

    getByUuid(uuid) {
        return this.decks.findOne({ uuid: uuid })
            .catch(err => {
                logger.error('Unable to fetch deck', err);
                throw new Error('Unable to fetch deck ' + uuid);
            });        
    }

    findByUserName(userName) {
        let decks = this.decks.find({ username: userName, banned: false }, { sort: { lastUpdated: -1 } });
        return decks;
    }
 
    create(deck) {
        return request.get('https://www.keyforgegame.com/api/decks/' + deck.uuid + '/?links=cards', (error, res, body) => {
            if(error) {
                throw new Error('url error');
            }
            let deckResponse = JSON.parse(body);
            if(!deckResponse || !deckResponse._linked || !deckResponse.data) {
                return;
            }
            let cards = deckResponse._linked.cards.map(card => {
                let id = card.card_title.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-');
                if(card.is_maverick) {
                    return { id: id, count: 1, maverick: card.house.toLowerCase() };
                }
                return { id: id, count: deckResponse.data._links.cards.filter(uuid => uuid === card.id).length };
            });
            return this.decks.insert({
                username: deck.username,
                uuid: deckResponse.data.id,
                identity: deckResponse.data.name.toLowerCase().replace(/[,?.!"„“”]/gi, '').replace(/[ '’]/gi, '-'),
                cardback: '',
                name: deckResponse.data.name,
                banned: false,
                houses: deckResponse.data._links.houses.map(house => house.toLowerCase()),
                cards: cards
            });    
        });
    }
    

    update(deck) {
        let properties = {
            username: deck.username,
            name: deck.deckName,
            houses: deck.houses,
            cards: deck.cards,
            lastUpdated: new Date()
        };

        return this.decks.update({ _id: deck.id }, { '$set': properties });
    }

    delete(id) {
        return this.decks.remove({ _id: id });
    }
}

module.exports = DeckService;

