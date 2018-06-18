const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');

class PlayCharacterAction extends BaseAction {
    constructor(card) {
        super(card, [
            Costs.chooseFate(),
            Costs.payReduceableFateCost('play'),
            Costs.playLimited()
        ]);
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext()) {
        if(context.game.currentPhase === 'dynasty') {
            return 'phase';
        }
        if(!context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        if(!context.source.canPlay(context)) {
            return 'triggerAbility';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', { player: context.player, card: context.source, originalLocation: context.source.location });
        let putIntoPlayHandler = () => {
            context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.chooseFate);
            context.game.openEventWindow([GameActions.putIntoPlay({ fate: context.chooseFate }).getEvent(context.source, context), cardPlayedEvent]);
        };
        if(context.source.allowGameAction('putIntoConflict', context)) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.chooseFate);
                        context.game.openEventWindow([GameActions.putIntoConflict({ fate: context.chooseFate }).getEvent(context.source, context), cardPlayedEvent]);
                    },
                    putIntoPlayHandler
                ]
            });
        } else {
            putIntoPlayHandler();
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

