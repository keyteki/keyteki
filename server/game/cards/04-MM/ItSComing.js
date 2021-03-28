const Card = require('../../Card.js');

class ItsComing extends Card {
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
