const AbilityContext = require('./AbilityContext');
const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class BaseAction extends BaseAbility {
    constructor(card, costs = [], target) {
        costs.push(Costs.useInitiateAction());
        let properties = { cost: costs };
        if(target) {
            properties.target = target;
        }
        super(properties);
        this.card = card;
        this.abilityType = 'action';
        this.cannotBeCancelled = true;
    }

    createContext() {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: this.card.controller,
            source: this.card,
            stage: 'pretarget'
        });
    }

    isAction() {
        return true;
    }
}

module.exports = BaseAction;

