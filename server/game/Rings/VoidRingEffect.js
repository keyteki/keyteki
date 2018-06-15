const BaseAbility = require('../baseability.js');
const GameActions = require('../GameActions/GameActions');

class VoidRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({
            target: {
                activePromptTitle: 'Choose character to remove fate from',
                source: 'Void Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: 'character',
                gameAction: GameActions.removeFate()
            }
        });

        this.cannotTargetFirst = true;
        this.title = 'Void Ring Effect';
        this.defaultPriority = 2; // Default resolution priority when players have ordering switched off
    }

    executeHandler(context) {
        if(context.target) {
            context.game.addMessage('{0} resolves the {1} ring, removing a fate from {2}', context.player, 'void', context.target);
            context.game.applyGameAction(context, { removeFate: context.target });
        } else {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'void');
        }
    }
}

module.exports = VoidRingEffect;
