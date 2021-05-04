const Card = require('../../Card.js');

class MagdaTheRat extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'steal 2 amber',
            gameAction: [
                ability.actions.steal({ amount: 2 }),
                ability.actions.delayedEffect((context) => ({
                    when: {
                        onCardLeavesPlay: (event) => {
                            console.log(event.card.id, context.source.id);
                            return event.card === context.source;
                        }
                    },
                    gameAction: ability.actions.steal({ target: context.player, amount: 2 }),
                    message: '{0} steals 2 amber due to {1} leaving play'
                }))
            ]
        });
    }
}

MagdaTheRat.id = 'magda-the-rat';

module.exports = MagdaTheRat;
