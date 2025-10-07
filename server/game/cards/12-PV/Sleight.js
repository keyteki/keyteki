import Card from '../../Card.js';

class Sleight extends Card {
    // Destroyed: Shuffle each creature into its owner's deck.
    // Fate: For each enemy Shadows creature, shuffle a friendly creature into its owner's deck.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.game.creaturesInPlay,
                shuffle: true
            }))
        });

        this.fate({
            effect:
                "for each enemy Shadows creature, shuffle a friendly creature into its owner's deck",
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.game.activePlayer.opponent.creaturesInPlay.filter((card) =>
                    card.hasHouse('shadows')
                ).length,
                action: ability.actions.returnToDeck((context) => ({
                    promptForSelect: {
                        activePromptTitle:
                            "Choose a friendly creature to shuffle into its owner's deck",
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to shuffle {2} into their deck',
                        messageArgs: (cards) => [context.source, context.player, cards]
                    },
                    shuffle: true
                }))
            }))
        });
    }
}

Sleight.id = 'sleight';

export default Sleight;
