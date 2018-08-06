const _ = require('underscore');

const rawData = require('../scripts/keyforge.json');
const cards = require('./cards');
const Card = require('./Card.js');

class Deck {
    constructor(data) {
        let cardData = {};
        for(const card of rawData.CardData.filter(card => card.name !== '')) {
            let id = card.name.toLowerCase().replace(/"\?.!/gi, '').replace(/[ ']/gi, '-');
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
                armor: card.type === 'creature' ? (card.armor !== '' ? parseInt(card.armor) : 0) : null,
                traits: card.traits === '' ? [] : card.traits.split(', ').map(trait => trait.toLowerCase()),
                keywords: card.keywords === '' ? [] : card.keywords.split(', ').map(keyword => keyword.toLowerCase())
            };
        }
        let cards = [
            { id: 'foggify', count: 1 },
            { id: 'labwork', count: 2 },
            { id: 'library-access', count: 1 },
            { id: 'neuro-syphon', count: 1 },
            { id: 'remote-access', count: 1 },
            { id: 'batdrone', count: 2 },
            { id: 'dextre', count: 1 },
            { id: 'dr-escotera', count: 1 },
            { id: 'ganymede-archivist', count: 1 },
            { id: 'titan-mechanic', count: 1 },
            { id: 'begone', count: 1 },
            { id: 'shield-of-justice', count: 1 },
            { id: 'take-hostages', count: 1 },
            { id: 'virtuous-works', count: 1 },
            { id: 'potion-of-invulnerability', count: 2 },
            { id: 'sigil-of-brotherhood', count: 1 },
            { id: 'bulwark', count: 1 },
            { id: 'champion-anaphiel', count: 1 },
            { id: 'francus', count: 1 },
            { id: 'sargeant-zakiel', count: 1 },
            { id: 'staunch-knight', count: 1 },
            { id: 'save-the-pack', count: 1 },
            { id: 'ancient-bear', count: 2 },
            { id: 'dust-pixie', count: 1 },
            { id: 'flaxia', count: 1 },
            { id: 'inka-the-spider', count: 1 },
            { id: 'snufflegator', count: 2 },
            { id: 'mighty-tiger', count: 1 },
            { id: 'mushroom-man', count: 2 },
            { id: 'witch-of-the-eye', count: 1 }
        ];
        this.data = {
            houses: ['logos', 'sanctum', 'untamed'],
            cards: cards.map(card => ({
                count: card.count,
                card: cardData[card.id]
            }))
        };
    }

    prepare(player) {
        var result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, cardData => {
            let splitId = cardData.id.split('_');
            if(splitId.length > 1) {
                cardData.house = splitId[1];
                cardData.id = splitId[0];
            }
            let card = this.createCard(Card, player, cardData);
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

    createCard(baseClass, player, cardData) {
        var cardClass = cards[cardData.id] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
