const BaseAbility = require('../baseability.js');

class AirRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({ 
            target: {
                mode: 'select',
                activePromptTitle: 'Choose an effect to resolve',
                source: 'Air Ring',
                choices: {
                    'Gain 2 Honor': () => true,
                    'Take 1 Honor from opponent': context => context.player.opponent,
                    'Don\'t resolve': () => optional
                }
            }
        });
        this.title = 'Air Ring Effect';
        this.cannotTargetFirst = true;
    }

    meetsRequirements(context) {
        return this.canResolveTargets(context);
    }

    executeHandler(context) {
        if(context.select === 'Gain 2 Honor') {
            context.game.addMessage('{0} resolves the {1} ring, gaining 2 honor', context.player, 'air');
            context.game.addHonor(context.player, 2);
        } else if(context.select === 'Take 1 Honor from Opponent') {
            context.game.addMessage('{0} resolves the {1} ring, taking 1 honor from {2}', context.player, 'air', context.player.opponent);
            context.game.transferHonor(context.player.opponent, context.player, 1);            
        } else {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, context.game.currentConflict ? context.game.currentConflict.conflictRing : 'air');
        }
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = AirRingEffect;
