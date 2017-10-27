const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.chooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ]
        });
        this.title = 'Play this character';
        this.card = undefined;
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'character' &&
            context.source.location === 'hand' &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.canPlay()
        );
    }

    executeHandler(context) {
        
        context.source.fate = context.chooseFate;
        this.originalLocation = context.source.location;
        if(context.game.currentConflict) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.source.fate);
                        context.player.putIntoPlay(context.source, true);
                    },
                    () => {
                        context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.source.fate);
                        context.player.putIntoPlay(context.source, false);
                    }
                ]
            });
        } else {
            context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.source.fate);
            context.player.putIntoPlay(context.source);
        }
    }

    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayCharacterAction;

