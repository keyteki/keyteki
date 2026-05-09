const Card = require('../../Card.js');

class AbductOMatic extends Card {
    // After Fight: If you are haunted, capture 2A.
    //
    // Scrap: The least powerful friendly creature captures 2A.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.capture({ amount: 2 })
        });

        this.scrap({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.capture({ amount: 2 })
            }
        });
    }
}

AbductOMatic.id = 'abduct-o-matic';

module.exports = AbductOMatic;
