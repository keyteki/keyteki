const Card = require('../../Card.js');

class DiggingUpTheMonster extends Card {
    // Play: Search your deck and discard pile for two halves of a gigantic
    // creature and reveal them. Put them on top of your deck in any order.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'search for two parts of a Gigantic creature part and put them back on top of their deck',
            gameAction: ability.actions.search({
                cardCondition: (card) => card.gigantic,
                amount: 2,
                destination: 'deck'
            })
        });
    }
}

DiggingUpTheMonster.id = 'digging-up-the-monster';

module.exports = DiggingUpTheMonster;
