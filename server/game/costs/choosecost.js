const _ = require('underscore');

class ChooseCost {
    constructor(choices) {
        this.choices = choices;
    }

    canPay(context) {
        return _.any(this.choices, cost => cost.canPay(context));
    }

    resolve(context, result = { resolved: false }) {
        let payableCosts = _.pick(this.choices, cost => cost.canPay(context));
        let payableCostsSize = _.size(payableCosts);

        if(payableCostsSize === 0) {
            result.value = false;
            result.resolved = true;
            return result;
        }

        if(payableCostsSize === 1) {
            this.chosenCost = _.values(payableCosts)[0];
            return this.resolveCost(this.chosenCost, context, result);
        }

        this.context = context;
        this.result = result;

        context.game.promptWithMenu(context.player, this, {
            activePrompt: {
                menuTitle: 'Choose cost to pay',
                buttons: _.map(payableCosts, (cost, text) => {
                    return { text: text, arg: text, method: 'chooseCost' };
                })
            },
            source: context.source
        });

        return result;
    }

    chooseCost(player, choice) {
        this.chosenCost = this.choices[choice];
        this.resolveCost(this.chosenCost, this.context, this.result);
        return true;
    }

    resolveCost(cost, context, result) {
        if(cost.resolve) {
            return cost.resolve(context, result);
        }

        result.resolved = true;
        result.value = cost.canPay(context);
        return result;
    }

    pay(context) {
        this.chosenCost.pay(context);
    }
}

module.exports = ChooseCost;
