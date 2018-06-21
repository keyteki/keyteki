class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        let card = this.cardFunc(context);
        //handle cases where "card" is actually an array of cards
        if(card.length !== undefined && card.length > 0) {
            let result = true;
            card.forEach((subcard) => {
                result = result && this.action.canAffect(subcard);
            });
            return result;
        }
        return this.action.canAffect(card, context);
    }

    resolve(context) {
        let card = this.cardFunc(context);
        context.costs[this.action.name] = card;
        this.action.setTarget(card);
    }

    payEvent(context) {
        return this.action.getEventArray(context);
    }
}

module.exports = SpecificCardCost;
