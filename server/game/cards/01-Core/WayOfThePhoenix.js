const DrawCard = require('../../drawcard.js');

class WayOfThePhoenix extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Prevent an opponent contesting a ring',
            max: ability.limit.perPhase(1),
            condition: () => this.controller.opponent,
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            handler: context => {
                let elements = [context.ring.element];
                if(this.game.currentConflict && this.game.currentConflict.conflictRing === context.ring.element) {
                    elements = this.game.currentConflict.getElements();
                }
                let otherPlayer = this.game.getOtherPlayer(context.player);
                this.game.addMessage('{0} uses {1} to prevent {2} from initiating a conflict with the {3} ring{4}', context.player, this, otherPlayer, elements, elements.length > 1 ? 's' : '');
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'opponent',
                    effect: ability.effects.playerCannotInitiateConflict((card, context) => context.source.type === 'ring' && elements.includes(context.source.element))                    
                }));
            }
        });
    }
}

WayOfThePhoenix.id = 'way-of-the-phoenix';

module.exports = WayOfThePhoenix;
