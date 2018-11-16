const MaxPage = 10;
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

for(let i = 1; i < 2; i++) {
    let path = 'decks/?search=&page=' + i.toString();
    getDecks.push(apiRequest(path)
        .then(body => {
            for(let deck of body.data) {
                console.log(deck.name, deck.id);
                apiRequest('decks/' + deck.id + '/?links=cards')
                    .then(data => console.log(data._linked.cards.map(card => card.card_number)))
                    .then(data => {
                        let deckData = { username: 'public', banned: false };
                        deckData.name = deck.name;
                        deck.identity = deck.name.toLowerCase().replace(/[,?.!"]/gi, '').replace(/[ ']/gi, '-');
                        //deck.cardback = deck.identity + '_back';
                        deck.houses = deck._links.houses.map(house => house.toLowerCase());
                        deck.cards = [];
                        let mavCounter = 0;
                        for(let num of split.slice(3, 39)) {
                            let cardData = rawData.CardData.find(card => parseInt(card.number) === parseInt(num));
                            if(!deck.houses.includes(cardData.house)) {
                                deck.cards.push({ id: cardData.id, count: 1, maverick: split[39 + mavCounter] });
                                mavCounter++;
                            } else if(!cardData) {
                                throw new Error('Can\'t find data for ' + num);
                            } else {
                                let card = deck.cards.find(card => card.id === cardData.id);
                                if(card) {
                                    card.count += 1;
                                } else {
                                    deck.cards.push({ id: cardData.id, count: 1 });
                                }
                            }
                        }                                            
                    })
            }
        })
        .catch(body => console.log('error', body))
    );
}

Promise.all(getDecks)
    .then(() => db.close())
    .catch(() => db.close());

