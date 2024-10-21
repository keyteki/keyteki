const Card = require('../../Card.js');

class Sentinel extends Card {
    // Action: Stun an enemy creature. If that creature was already
    // stunned, destroy it instead.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [
                    ability.actions.destroy((context) => ({
                        target: context.target && context.target.stunned ? context.target : []
                    })),
                    ability.actions.stun((context) => ({
                        target: context.target && context.target.stunned ? [] : context.target
                    }))
                ]
            }
        });
    }
}

Sentinel.id = 'sentinel';

module.exports = Sentinel;
