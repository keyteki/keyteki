const Card = require('../../Card.js');

class OneTwoPunch extends Card {
    // Play: Stun an enemy creature.
    // If that creature was already stunned, destroy it instead.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [
                    ability.actions.destroy((context) => ({
                        target: context.target.stunned ? context.target : []
                    })),
                    ability.actions.stun((context) => ({
                        target: context.target.stunned ? [] : context.target
                    }))
                ]
            }
        });
    }
}

OneTwoPunch.id = '1-2-punch';

module.exports = OneTwoPunch;
