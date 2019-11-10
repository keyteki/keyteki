const Card = require('../../Card.js');

class RelentlessWhispers extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                message: '{0} uses {1} to steal 1 amber from {3}',
                messageArgs: context => [context.player.opponent],
                condition: context => context.preThenEvent.destroyed,
                gameAction: ability.actions.steal()
            }
        });
    }
}

RelentlessWhispers.id = 'relentless-whispers';

module.exports = RelentlessWhispers;
