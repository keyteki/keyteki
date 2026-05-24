const Card = require('../../Card.js');

class LateralShift extends Card {
    // Play: Look at your opponents hand. Play a card from that hand as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.opponent.hand
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    optional: (context) =>
                        context.player.opponent.hand.every((card) => {
                            let action = ability.actions.playCard();
                            action.setDefaultTarget(() => card);
                            action.update(context);
                            return !action.canAffect(card, context);
                        }),
                    controller: 'opponent',
                    revealTargets: true,
                    location: 'hand',
                    gameAction: ability.actions.playCard()
                }
            }
        });
    }
}

LateralShift.id = 'lateral-shift';

module.exports = LateralShift;
