const Card = require('../../Card.js');

class FinishingBlow extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => card.hasToken('damage'),
                gameAction: ability.actions.destroy()
            },
            then: {
                message: '{0} uses {1} to steal 1 amber from {3}',
                messageArgs: context => [context.player.opponent],
                gameAction: ability.actions.steal()
            }
        });
    }
}

FinishingBlow.id = 'finishing-blow';

module.exports = FinishingBlow;
