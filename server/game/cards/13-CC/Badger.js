const Card = require('../../Card.js');

class Badger extends Card {
    // Play/After Reap: For the remainder of the turn, after you play a Brobnar creature, deal 3 damage to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            effect:
                'deal 3 damage to an enemy creature after playing a Brobnar creature for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player &&
                        event.card !== context.source &&
                        event.card.type === 'creature' &&
                        event.card.hasHouse('brobnar')
                },
                preferActionPromptMessage: true,
                gameAction: ability.actions.dealDamage({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to deal 3 damage to {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    },
                    amount: 3
                })
            }))
        });
    }
}

Badger.id = 'badger';

module.exports = Badger;
