const ParentCost = require('./ParentCost.js');
const SelectCardCost = require('./SelectCardCost.js');
const SelfCost = require('./SelfCost.js');
const SpecificCardCost = require('./SpecificCardCost.js');

class CostBuilder {
    constructor(action, titles = {}) {
        this.action = action;
        this.titles = titles;
    }

    /**
     * Returns a cost that is applied to the card that activated the ability.
     */
    self() {
        return new SelfCost(this.action);
    }

    /**
     * Returns a cost that is applied to the card returned by the cardFunc param.
     * @param {function} cardFunc Function that takes the ability context and return a card.
     */
    specific(cardFunc) {
        return new SpecificCardCost(this.action, cardFunc);
    }

    /**
     * Returns a cost that asks the player to select a card matching the passed condition.
     * @param {function} condition Function that takes a card and ability context and returns whether to allow the player to select it.
     */
    select(condition = () => true) {
        return new SelectCardCost(this.action, {
            activePromptTitle: this.titles.select,
            cardCondition: condition
        });
    }

    /**
     * Returns a cost that asks the player to select an exact number of cards matching the passed condition.
     * @param {number} number The number of cards that must be selected.
     * @param {function} condition Function that takes a card and ability context and returns whether to allow the player to select it.
     */
    selectMultiple(number, condition = () => true) {
        return new SelectCardCost(this.action, {
            mode: 'exactly',
            numCards: number,
            activePromptTitle: this.titles.selectMultiple(number),
            cardCondition: condition
        });
    }

    /**
     * Returns a cost that is applied to the parent card that the activating card is attached to.
     */
    parent() {
        return new ParentCost(this.action);
    }
}

module.exports = CostBuilder;
