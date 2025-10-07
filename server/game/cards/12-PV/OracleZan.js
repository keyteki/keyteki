import Card from '../../Card.js';

class OracleZan extends Card {
    // After Reap: Move each amber from a friendly creature to the common supply. For each amber moved, heal 2 damage from a creature.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'move amber from {1} to the common supply and heal damage',
            effectArgs: (context) => [context.target],
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({
                    all: true
                })
            },
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvent.amount,
                    action: ability.actions.heal((context) => ({
                        amount: 2,
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to heal',
                            cardType: 'creature',
                            controller: 'any',
                            message: '{0} uses {1} to heal {2} for 2 damage',
                            messageArgs: (cards) => [context.player, context.source, cards]
                        }
                    }))
                }))
            }
        });
    }
}

OracleZan.id = 'oracle-zan';

export default OracleZan;
