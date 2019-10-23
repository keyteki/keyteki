const Card = require('../../Card.js');

class MagdaTheRat extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.steal({ amount: 2 }),
                ability.actions.cardLastingEffect(context => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.delayedEffect({
                        when: { onCardLeavesPlay: event => event.card === context.source },
                        gameAction: ability.actions.steal({ target: context.player, amount: 2 }),
                        message: '{0} steals 2 amber from {1} due to {2} leaving play',
                        messageArgs: [context.player.opponent, context.player, context.source]
                    })
                }))
            ]
        });
    }
}

MagdaTheRat.id = 'magda-the-rat';

module.exports = MagdaTheRat;
