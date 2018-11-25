const _ = require('underscore');

const rawData = require('../scripts/keyforge.json');
const cards = require('./cards');
const Card = require('./Card.js');

class Deck {
    constructor(data) {
        let cardData = {};
        for(const card of rawData.CardData.filter(card => card.name !== '')) {
            let id = card.name.toLowerCase().replace(/[,?".!]/gi, '').replace(/[ ']/gi, '-');
            let keywords = {};
            if(card.keywords) {
                for(const keyword of card.keywords.split(', ')) {
                    let split = keyword.split(':');
                    keywords[split[0].toLowerCase()] = split.length > 1 && parseInt(split[1]) ? parseInt(split[1]) : 1;
                }
            }
            cardData[id] = {
                name: card.name,
                id: id,
                text: card.text,
                rarity: card.rarity,
                number: card.number,
                type: card.type.toLowerCase(),
                house: card.house.toLowerCase(),
                amber: card.amber === '' ? 0 : parseInt(card.amber),
                power: card.power === '' ? null : parseInt(card.power),
                armor: card.type.toLowerCase() === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null,
                traits: card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase()),
                keywords: keywords,
                image: id
            };
        }
        let cards = data.cards;
        let houses = data.houses;
        if(!houses) {
            cards = [
                { id: 'arise', count: 1 },
                { id: 'control-the-weak', count: 1 },
                { id: 'hand-of-dis', count: 1 },
                { id: 'mind-barb', count: 1 },
                { id: 'three-fates', count: 1 },
                { id: 'lash-of-broken-dreams', count: 1 },
                { id: 'ember-imp', count: 1 },
                { id: 'pit-demon', count: 1 },
                { id: 'pitlord', count: 2 },
                { id: 'shooler', count: 1 },
                { id: 'succubus', count: 1 },
                { id: 'shield-of-justice', count: 1 },
                { id: 'blinding-light', count: 2 },
                { id: 'charge', count: 1 },
                { id: 'protectrix', count: 3 },
                { id: 'sigil-of-brotherhood', count: 1 },
                { id: 'bulwark', count: 1 },
                { id: 'francus', count: 1 },
                { id: 'staunch-knight', count: 1 },
                { id: 'shoulder-armor', count: 1 },
                { id: 'key-charge', count: 1 },
                { id: 'lost-in-the-woods', count: 1 },
                { id: 'ancient-bear', count: 1 },
                { id: 'regrowth', count: 2 },
                { id: 'word-of-returning', count: 1 },
                { id: 'hunting-witch', count: 1 },
                { id: 'murmook', count: 2 },
                { id: 'way-of-the-bear', count: 1 },
                { id: 'witch-of-the-eye', count: 2 }
            ];
            houses = ['dis', 'sanctum', 'untamed'];
        }
        this.data = {
            houses: houses,
            cards: cards.map(card => {
                let result = {
                    count: card.count,
                    card: cardData[card.id]
                };
                if(card.maverick) {
                    result.card.house = card.maverick;
                    result.card.image = card.id + '_' + card.maverick;
                }
                return result;
            })
        };
    }

    prepare(player) {
        var result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, cardData => {
            let card = this.createCard(player, cardData);
            card.location = 'deck';
            result.cards.push(card);
        });

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(player, cardData) {
        if(!cardData || !cardData.id) {
            throw new Error('no cardData for ' + JSON.stringify(this.data));
        } else if(!cards[cardData.id]) {
            return new Card(player, cardData);
        }
        var cardClass = cards[cardData.id];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
