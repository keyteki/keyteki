const Card = require('../../Card.js');

class Pincerator extends Card {
    // At the end of each turn, deal 1D to each flank creature.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter((card) => card.isOnFlank())
            }))
        });
    }
}

Pincerator.id = 'pincerator';

module.exports = Pincerator;
