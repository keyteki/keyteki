const Card = require('../../Card.js');

class MagdaTheRat extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: Steal 2<A>.
    // Leaves Play: Your opponent steals 2<A>.
    setupCardAbilities(ability) {
        this.play({
            effect: 'steal 2 amber',
            gameAction: [
                ability.actions.steal({ amount: 2 }),
                ability.actions.lastingEffect((context) => ({
                    multipleTrigger: false,
                    when: {
                        onCardLeavesPlay: (event, context) => event.card === context.source
                    },
                    gameAction: ability.actions.steal({ target: context.player, amount: 2 }),
                    message: '{0} steals 2 amber due to {1} leaving play',
                    messageArgs: (context) => [context.player, context.source]
                }))
            ]
        });
    }
}

MagdaTheRat.id = 'magda-the-rat';

module.exports = MagdaTheRat;
