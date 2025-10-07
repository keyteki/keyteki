import Card from '../../Card.js';

class BogSpitter extends Card {
    // After Fight: Discard a random card from a player's hand.
    //
    // Scrap: If your opponent has 6 or more, steal 1.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's hand",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.discardAtRandom((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player
                        : context.player.opponent
            }))
        });

        this.scrap({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent.amber >= 6 ? 1 : 0
            }))
        });
    }
}

BogSpitter.id = 'bog-spitter';

export default BogSpitter;
