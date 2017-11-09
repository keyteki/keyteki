const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.chooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited(),
                Costs.useInitiateAction()                
            ]
        });
        this.title = 'Play this character';
        this.abilityType = 'action';
        this.cannotBeCancelled = true;
        this.location = ['hand'];
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'character' &&
            this.location.includes(context.source.location) &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.canPlay() &&
            this.canPayCosts(context)
        );
    }

    executeHandler(context) {
        
        context.source.fate = context.chooseFate;
        if(context.game.currentConflict) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.source.fate);
                        context.player.putIntoPlay(context.source, true, true);
                    },
                    () => {
                        context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.source.fate);
                        context.player.putIntoPlay(context.source, false, true);
                    }
                ]
            });
        } else {
            context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.source.fate);
            context.player.putIntoPlay(context.source, false, true);
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

