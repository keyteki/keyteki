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
                let elements = context.ring.getElements();
                let otherPlayer = context.player.opponent;
                this.game.addMessage('{0} plays {1} to prevent {2} from delcaring a conflict with the {3} ring{4}', context.player, context.source, otherPlayer, elements, elements.length > 1 ? 's' : '');
                elements.forEach(element => {
                    context.source.untilEndOfPhase(ability => ({
                        targetType: 'ring',
                        match: this.game.rings[element],
                        effect: ability.effects.addRingEffect('cannotDeclare', player => player === otherPlayer)                    
                    }));    
                });
            }
        });
    }
}

WayOfThePhoenix.id = 'way-of-the-phoenix';

module.exports = WayOfThePhoenix;
