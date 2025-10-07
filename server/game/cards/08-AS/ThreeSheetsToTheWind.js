import _ from 'underscore';
import Card from '../../Card.js';

class ThreeSheetsToTheWind extends Card {
    // Play: Your opponent draws 3 cards, discards a random card from
    // their hand, puts a random card from their hand on top of their
    // deck, and purges a random card from their hand.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.sequential([
                ability.actions.draw((context) => ({
                    target: context.player.opponent,
                    amount: 3
                })),
                ability.actions.discardAtRandom((context) => ({
                    target: context.player.opponent,
                    amount: 1
                })),
                ability.actions.returnToDeck((context) => ({
                    target: context.player.opponent
                        ? _.shuffle(context.player.opponent.hand).slice(0, 1)
                        : []
                })),
                ability.actions.purgeAtRandom((context) => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            ])
        });
    }
}

ThreeSheetsToTheWind.id = 'three-sheets-to-the-wind';

export default ThreeSheetsToTheWind;
