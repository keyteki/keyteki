import Card from '../../Card.js';

class UrxymTheDiplomat extends Card {
    // After Reap: Lose all your A. Destroy an enemy non-Mars creature
    // for each A lost this way.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player,
                amount: context.player.amber
            })),
            then: (preThenContext) => ({
                gameAction: ability.actions.sequentialForEach({
                    num: preThenContext.player.amber,
                    action: ability.actions.destroy((context) => ({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to destroy',
                            cardType: 'creature',
                            controller: 'opponent',
                            cardCondition: (card) => !card.hasHouse('mars'),
                            message: '{0} uses {1} to destroy {2}',
                            messageArgs: (cards) => [context.player, context.source, cards]
                        }
                    }))
                })
            })
        });
    }
}

UrxymTheDiplomat.id = 'urxym-the-diplomat';

export default UrxymTheDiplomat;
