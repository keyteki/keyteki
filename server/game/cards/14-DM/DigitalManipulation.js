const Card = require('../../Card.js');

class DigitalManipulation extends Card {
    // Play: Discard the top card of your opponent's deck. If it is not a Mars card, an enemy creature captures 1A from its own side.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            preferActionPromptMessage: true,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0, 1)
            })),
            then: () => ({
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvent &&
                    context.preThenEvent.card &&
                    !context.preThenEvent.card.hasHouse('mars'),
                target: {
                    activePromptTitle: 'Choose an enemy creature',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.capture({ amount: 1 })
                }
            })
        });
    }
}

DigitalManipulation.id = 'digital-manipulation';

module.exports = DigitalManipulation;
