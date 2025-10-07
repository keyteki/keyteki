import Card from '../../Card.js';

class RageReset extends Card {
    // Play: Destroy any number of friendly creatures. Draw 1 card for each creature destroyed this way.
    // Fate: Randomly discard half of the cards from your hand (rounding down).
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'unlimited',
                location: ['play area'],
                cardCondition: (card) => card.type === 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });

        this.fate({
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.game.activePlayer,
                amount: Math.floor(context.game.activePlayer.hand.length / 2)
            }))
        });
    }
}

RageReset.id = 'rage-reset';

export default RageReset;
