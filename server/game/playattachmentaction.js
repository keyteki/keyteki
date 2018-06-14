const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const AttachAction = require('./GameActions/AttachAction');

class PlayAttachmentAction extends BaseAction {
    constructor(card) {
        super(card, [Costs.payTargetDependentFateCost('target', 'play'), Costs.playLimited()], {
            gameAction: new AttachAction(context => ({ attachment: context.source })),
            cardCondition: (card, context) => context.source.canPlayOn(card)
        });
        this.title = 'Play this attachment';
    }
    
    meetsRequirements(context = this.createContext()) {
        if(context.game.currentPhase === 'dynasty') {
            return 'phase';
        }
        if(!context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        if(!context.source.canPlay(context)) {
            return 'cannotTrigger';
        }
        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', { 
            player: context.player, 
            card: context.source, 
            originalLocation: context.source.location 
        });
        context.game.openEventWindow([new AttachAction({ attachment: context.source }).getEvent(context.target, context), cardPlayedEvent]);
    }
    
    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentAction;

