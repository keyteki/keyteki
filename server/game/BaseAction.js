const AbilityContext = require('./AbilityContext');
const BaseAbility = require('./baseability.js');

class BaseAction extends BaseAbility {
    constructor(card, target) {
        let properties = {};
        if(target) {
            properties.target = target;
        }
        super(properties);
        this.card = card;
        this.abilityType = 'action';
        this.cannotBeCancelled = true;
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
}

module.exports = BaseAction;

