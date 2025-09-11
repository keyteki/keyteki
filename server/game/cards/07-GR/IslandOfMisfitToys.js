const Card = require('../../Card.js');

class IslandOfMisfitToys extends Card {
    // Action: Return each Geistoid card from your discard pile to
    // your hand. Purge Island of Misfit Toys.
    setupCardAbilities(ability) {
        this.action({
            effect: 'return {1} to their hand and purge {0}',
            effectArgs: (context) => [
                context.player.discard.filter((card) => card.hasHouse('geistoid'))
            ],
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    target: context.player.discard.filter((card) => card.hasHouse('geistoid'))
                })),
                ability.actions.purge((context) => ({
                    target: context.source
                }))
            ]
        });
    }
}

IslandOfMisfitToys.id = 'island-of-misfit-toys';

module.exports = IslandOfMisfitToys;
