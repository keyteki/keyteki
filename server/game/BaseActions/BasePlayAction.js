const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const ThenAbility = require('../ThenAbility');
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
        context.game.addMessage('{0} plays {1}', context.player, context.source);
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

    addBonusIconResolution(event, context) {
        event.addSubEvent(context.game.getEvent('unnamedEvent', {}, () => {
            context.game.checkGameState(true);
            context.game.actions.resolveBonusIcons().resolve(this.card, context);
        }));
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = BasePlayAction;

