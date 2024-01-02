const Card = require('../../Card.js');

class GhostTree extends Card {
    // While you are haunted, Ghost Tree deals no damage when fighting.
    //
    // Scrap: Discard the top 5 cards of your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.limitFightDamage(0)
        });

        this.scrap({
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.player.deck.length > 0
                        ? context.player.deck.slice(0, Math.min(5, context.player.deck.length))
                        : []
            }))
        });
    }
}

GhostTree.id = 'ghost-tree';

module.exports = GhostTree;
