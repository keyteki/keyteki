const Card = require('../../Card.js');

class ClosedDoorNegotiation extends Card {
    // Play: Your opponent draws a card. Steal 1 Aember. If you
    // do and your opponent still has more Aember than you,
    // trigger this effect again.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.draw((context) => ({
                    target: context.player.opponent
                })),
                ability.actions.steal()
            ],
            then: (preThenContext) => ({
                condition: (context) => context.player.amber < context.player.opponent.amber,
                alwaysTriggers: true,
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

ClosedDoorNegotiation.id = 'closed-door-negotiation';

module.exports = ClosedDoorNegotiation;
