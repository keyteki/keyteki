const Card = require('../../Card.js');

class ItsComing extends Card {
    // Play: Search your deck and discard pile for either half of a gigantic creature, reveal it, and put it into your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for a Gigantic creature part and shuffle discard into their deck',
            gameAction: ability.actions.search({
                cardCondition: (card) => card.gigantic,
                amount: 1
            })
        });
    }
}

ItsComing.id = 'it-s-coming';

module.exports = ItsComing;
