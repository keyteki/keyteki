const Card = require('../../Card.js');

class ContractExecution extends Card {
    // Play: For the remainder of the turn, each time you play a
    // creature, deal 2D to a creature.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'deal 2 damage to a creature after playing a creature for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player &&
                        event.card !== context.source &&
                        event.card.type === 'creature'
                },
                preferActionPromptMessage: true,
                gameAction: ability.actions.dealDamage({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'any',
                        message: '{0} uses {1} to deal 2 damage to {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    },
                    amount: 2
                })
            }))
        });
    }
}

ContractExecution.id = 'contract-execution';

module.exports = ContractExecution;
