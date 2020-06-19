const Card = require('../../Card.js');

class Pincerator extends Card {
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
