/*eslint no-console:0 */
const request = require('request');
const monk = require('monk');
const DeckService = require('../services/DeckService.js');

function apiRequest(path) {
    const apiUrl = 'https://www.keyforgegame.com/api/';

    return new Promise((resolve, reject) => {
        request.get(apiUrl + path, function(error, res, body) {
            if(error) {
                return reject(error);
            }

            resolve(JSON.parse(body));
        });
    });
}
let rawData = require('./keyforge.json');
for(const card of rawData.CardData.filter(card => card.name !== '')) {
    card.id = card.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
    card.type = card.type.toLowerCase();
    card.house = card.house.toLowerCase();
    card.amber = card.amber === '' ? 0 : parseInt(card.amber);
    card.power = card.power === '' ? null : parseInt(card.power);
    card.armor = card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null;
    card.traits = card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase());
    card.keywords = card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase());
}

let getDecks = [];
let db = monk('mongodb://127.0.0.1:27017/keyforge');
let deckService = new DeckService(db);

for(let i = 3400; i < 3600; i++) {
    let path = 'decks/?search=&page=' + i.toString();
    getDecks.push(apiRequest(path)
        .then(body => {
            return body.data.map(deck => {
                return deckService.getByUuid(deck.id)
                    .then(storedDeck => {
                        if(storedDeck) {
                            return;
                        }

                        return apiRequest('decks/' + deck.id + '/?links=cards')
                            .then(data => {
                                let deckData = { banned: false };
                                deckData.uuid = deck.id;
                                deckData.name = deck.name;
                                deckData.identity = deck.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
                                //deck.cardback = deck.identity + '_back';
                                deckData.houses = deck._links.houses.map(house => house.toLowerCase());
                                if(data._linked.cards.some(card => card.is_maverick)) {
                                    console.log(deck.name, 'has maverick');
                                    return;
                                }

                                deckData.cards = [];
                                for(let uuid of deck.cards) {
                                    let num = data._linked.cards.find(card => card.id === uuid).card_number;
                                    let cardData = rawData.CardData.find(card => parseInt(card.number) === num);
                                    if(!cardData) {
                                        throw new Error('Can\'t find data for ' + num);
                                    } else {
                                        let card = deckData.cards.find(card => card.id === cardData.id);
                                        if(card) {
                                            card.count += 1;
                                        } else {
                                            deckData.cards.push({ id: cardData.id, count: 1 });
                                        }
                                    }
                                }

                                console.log('creating record for ', deck.name);
                                return deckService.create(deckData);
                            });
                    });
            });
        })
        .catch(body => console.log('error', body))
    );
}

Promise.all(getDecks)
    .then(() => db.close())
    .catch(() => db.close());

