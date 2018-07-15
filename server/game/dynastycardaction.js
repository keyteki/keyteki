const BaseAction = require('./BaseAction');
const Costs = require('./costs.js');
const GameActions = require('./GameActions/GameActions');

class DynastyCardAction extends BaseAction {
    constructor(card) {
        super(card, [
            Costs.chooseFate(),
            Costs.payReduceableFateCost('play'),
            Costs.playLimited()
        ]);
        this.title = 'Play this character';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        this.originalLocation = this.card.location;
        if(!ignoredRequirements.includes('facedown') && this.card.facedown) {
            return 'facedown';
        } else if(!ignoredRequirements.includes('player') && context.player !== this.card.controller) {
            return 'player';
        } else if(!ignoredRequirements.includes('phase') && context.game.currentPhase !== 'dynasty') {
            return 'phase';
        } else if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(this.card, 'dynasty')) {
            return 'location';
        } else if(!ignoredRequirements.includes('cannotTrigger') && !this.card.canPlay(context)) {
            return 'cannotTrigger';
        } else if(this.card.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.chooseFate);
    }

    executeHandler(context) {
        let enterPlayEvent = GameActions.putIntoPlay({ fate: context.chooseFate }).getEvent(context.source, context);
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location,
            playType: 'dynasty'
        });
        context.game.openEventWindow([enterPlayEvent, cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = DynastyCardAction;
