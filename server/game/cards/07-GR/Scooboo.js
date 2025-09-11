const Card = require('../../Card.js');

class Scooboo extends Card {
    // While Scooboo is in your discard pile, if you would draw a card
    // during your turn, you may discard the top 3 cards of your deck
    // and return Scooboo from your discard pile to your hand instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'discard',
            effect: ability.effects.drawOneAtATimeDuringTurn()
        });

        this.interrupt({
            when: {
                onDrawCards: (event, context) =>
                    event.player === context.player &&
                    context.game.activePlayer === context.player &&
                    event.amount > 0
            },
            optional: true,
            location: 'discard',
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, Math.min(3, context.player.deck.length))
                })),
                ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    target: context.source
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    amount: 0
                }))
            ]
        });
    }
}

Scooboo.id = 'scooboo';

module.exports = Scooboo;
