const BaseAbility = require('../baseability.js');

class FireRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                activePromptTitle: 'Choose character to honor or dishonor',
                source: 'Fire Ring',
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            }
        });
        this.title = 'Resolve the Fire Ring';
        this.optional = optional;
        this.cannotTargetFirst = !optional;
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        let choices = [];
        let handlers = [];
        if(context.target.isHonored) {
            choices.push('Honor ' + context.target.name);
            handlers.push(() => {
                context.game.addMessage('{0} resolves the {1} ring, honoring {2}', context.player, 'fire', context.target);
                context.player.honorCard(context.target);
            });
        } else if(context.target.allowGameAction('dishonor')) {
            choices.push('Dishonor ' + context.target.name);
            handlers.push(() => {
                context.game.addMessage('{0} resolves the {1} ring, dishonoring {2}', context.player, 'fire', context.target);
                context.player.dishonorCard(context.target);
            });
        }
        choices.push('Back');
        handlers.push(() => context.game.resolveAbility(context));
        if(this.optional) {
            choices.push('Cancel');
            handlers.push(() => true);
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
