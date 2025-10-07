import Card from '../../Card.js';

class PenPal extends Card {
    // Action: Exhaust an enemy creature. If you do, each player gains 1A.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            },
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: [context.player, context.player.opponent]
                }))
            }
        });
    }
}

PenPal.id = 'pen-pal';

export default PenPal;
