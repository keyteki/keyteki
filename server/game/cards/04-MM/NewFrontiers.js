const Card = require('../../Card.js');

class NewFrontiers extends Card {
    // Play: Choose a house. Reveal the top 3 cards of your deck. Archive each card of the chosen house and discard the others.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            condition: (context) => context.player.deck.length > 0,
            effect: 'choose {1} and reveal the top 3 cards of their deck: {2}',
            effectArgs: (context) => [context.house, context.player.deck.slice(0, 3)],
            gameAction: [
                ability.actions.archive((context) => ({
                    target: context.player.deck
                        .slice(0, 3)
                        .filter((card) => card.hasHouse(context.house))
                })),
                ability.actions.discard((context) => ({
                    target: context.player.deck
                        .slice(0, 3)
                        .filter((card) => !card.hasHouse(context.house))
                }))
            ]
        });
    }
}

NewFrontiers.id = 'new-frontiers';

module.exports = NewFrontiers;
