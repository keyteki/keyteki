const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const Costs = require('../costs.js');

class BasePlayAction extends BaseAbility {
    constructor(card, target) {
        let properties = { cost: Costs.play() };
        if(target) {
            properties.target = target;
        }
        super(properties);
        this.card = card;
        this.abilityType = 'action';
    }

    displayMessage(context) {
        let amberMsg = context.source.printedAmber > 0 ? ', gaining ' + context.source.printedAmber.toString() + ' amber' : '';
        context.player.modifyAmber(context.source.printedAmber);
        context.game.addMessage('{0} plays {1}{2}', context.player, context.source, amberMsg);
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        } else if(!ignoredRequirements.includes('cannotTrigger') && (!context.player.checkRestrictions('play', context) || !context.source.checkRestrictions('play', context))) {
            return 'cannotTrigger';
        }
        return super.meetsRequirements(context);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = BasePlayAction;

