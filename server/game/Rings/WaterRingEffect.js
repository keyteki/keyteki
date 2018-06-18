const BaseAbility = require('../baseability.js');

class WaterRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({
            target: {
                activePromptTitle: 'Choose character to bow or unbow',
                source: 'Water Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && ((card.fate === 0 && card.allowGameAction('bow', context)) || card.bowed)
            }
        });
        this.cannotTargetFirst = true;
        this.title = 'Water Ring Effect';
        this.defaultPriority = 3; // Default resolution priority when players have ordering switched off
    }

    executeHandler(context) {
        if(!context.target) {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, 'water');
            return;
        }
        if(context.target.bowed) {
            context.game.addMessage('{0} resolves the {1} ring, readying {2}', context.player, 'water', context.target);
            context.game.applyGameAction(context, { ready: context.target });
        } else {
            context.game.addMessage('{0} resolves the {1} ring, bowing {2}', context.player, 'water', context.target);
            context.game.applyGameAction(context, { bow: context.target });
        }
    }
}

module.exports = WaterRingEffect;
