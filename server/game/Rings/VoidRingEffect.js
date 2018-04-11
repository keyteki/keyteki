const BaseAbility = require('../baseability.js');

class VoidRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                activePromptTitle: 'Choose character to remove fate from',
                source: 'Void Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: 'character',
                gameAction: 'removeFate'
            }
        });

        this.cannotTargetFirst = true;
        this.title = 'Void Ring Effect';
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        if(context.target) {
            context.game.addMessage('{0} resolves the {1} ring, removing a fate from {2}', context.player, context.game.currentConflict ? context.game.currentConflict.conflictRing : 'void', context.target);
            context.game.applyGameAction(context, { removeFate: context.target });
        } else {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'void');
        }
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = VoidRingEffect;
