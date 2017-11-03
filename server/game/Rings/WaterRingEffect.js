const BaseAbility = require('../baseability.js');

class WaterRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                activePromptTitle: 'Choose character to bow or unbow',
                source: 'Water Ring',
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && ((card.fate === 0 && card.allowGameAction('bow', context)) || card.bowed)
            }
        });
        this.title = 'Resolve the Water Ring';
        this.optional = optional;
        this.cannotTargetFirst = !optional;
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        if(context.target.bowed) {
            context.game.addMessage('{0} resolves the {1} ring, readying {2}', context.player, 'water', context.target);
            context.player.readyCard(context.target, context.source);
        } else {
            context.game.addMessage('{0} resolves the {1} ring, bowing {2}', context.player, 'water', context.target);
            context.player.bowCard(context.target, context.source);            
        }
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = WaterRingEffect;
