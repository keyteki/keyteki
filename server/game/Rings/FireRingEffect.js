const BaseAbility = require('../baseability.js');

class FireRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({
            target: {
                activePromptTitle: 'Choose character to honor or dishonor',
                source: 'Fire Ring',
                cardType: 'character',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardCondition: card => card.location === 'play area' && (card.allowGameAction('honor') || card.allowGameAction('dishonor'))
            }
        });
        this.title = 'Fire Ring Effect';
        this.optional = optional;
        this.cannotTargetFirst = true;
        this.defaultPriority = 4; // Default resolution priority when players have ordering switched off
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        if(!context.target) {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, context.game.currentConflict ? context.game.currentConflict.conflictRing : 'fire');
            return;
        }
        let choices = [];
        let handlers = [];
        if(context.target.allowGameAction('honor', context)) {
            choices.push('Honor ' + context.target.name);
            handlers.push(() => {
                context.game.addMessage('{0} resolves the {1} ring, honoring {2}', context.player, 'fire', context.target);
                context.game.applyGameAction(context, { honor: context.target });
            });
        }
        if(context.target.allowGameAction('dishonor', context)) {
            choices.push('Dishonor ' + context.target.name);
            handlers.push(() => {
                context.game.addMessage('{0} resolves the {1} ring, dishonoring {2}', context.player, 'fire', context.target);
                context.game.applyGameAction(context, { dishonor: context.target });
            });
        }
        choices.push('Back');
        handlers.push(() => context.game.resolveAbility(context));
        if(this.optional) {
            choices.push('Don\'t resolve the fire ring');
            handlers.push(() => context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, context.game.currentConflict ? context.game.currentConflict.conflictRing : 'fire'));
        }
        context.game.promptWithHandlerMenu(context.player, {
            choices: choices,
            handlers: handlers,
            source: 'Fire Ring'
        });
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = FireRingEffect;
