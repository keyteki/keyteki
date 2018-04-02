const BaseAbility = require('../baseability.js');

class VoidRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                activePromptTitle: 'Choose character to remove fate from',
                source: 'Void Ring',
                cardType: 'character',
                gameAction: 'removeFate'
            }
        });
        this.title = 'Void Ring Effect';
        this.optional = optional;
        this.cannotTargetFirst = !optional;
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        context.game.addMessage('{0} resolves the {1} ring, removing a fate from {2}', context.player, 'void', context.target);
        context.game.applyGameAction(context, { removeFate: context.target });
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = VoidRingEffect;
