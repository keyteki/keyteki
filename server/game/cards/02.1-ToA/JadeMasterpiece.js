const DrawCard = require('../../drawcard.js');

class JadeMasterpiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a fate to an unclaimed ring',
            cost: ability.costs.bowSelf(),
            target: {
                mode: 'ring',
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => !ring.claimed && !ring.contested && ring.fate > 0
            },
            handler: context => this.game.promptForRingSelect(this.controller, {
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                ringCondition: ring => !ring.claimed && !ring.contested && ring !== context.ring,
                onSelect: (player, ring) => {
                    this.game.addMessage('{0} uses {1} to move 1 fate from the {2} ring to the {3} ring', player, this, context.ring.element, ring.element);
                    context.ring.modifyFate(-1);
                    ring.modifyFate(1);
                    return true;
                }
            })
        });
    }
}

JadeMasterpiece.id = 'jade-masterpiece';

module.exports = JadeMasterpiece;
