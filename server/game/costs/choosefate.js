const _ = require('underscore');
const ChooseCost = require('./choosecost.js');
const Costs = require('../costs.js');

class ChooseFate extends ChooseCost {
    constructor() {
        super([
            Costs.payFate(0),
            Costs.payFate(1),
            Costs.payFate(2),
            Costs.payFate(3)
        ]);
        this.fate = 0;
    }

    resolve(context, result = { resolved: false }) {
        let extrafate = context.player.fate - context.player.getReducedCost('play', context.source);
        if(extrafate > 3) {
            extrafate = 3;
        }
        
        if(extrafate < 0) {
            result.value = false;
            result.resolved = true;
            return result;
        }

        let payableCosts = _.first(this.choices, extrafate + 1);
        this.context = context;
        this.result = result;
        
        let buttons = _.map(payableCosts, (cost, text) => {
            return { text: text, arg: text, method: 'chooseCost' };
        });
        buttons.push({ text: 'Cancel', arg: 'Cancel', method: 'chooseCost' });

        context.game.promptWithMenu(context.player, this, {
            activePrompt: {
                menuTitle: 'Choose additional Fate',
                buttons: buttons
            },
            source: context.source
        });

        return result;
    }

    chooseCost(player, choice) {
        this.chosenCost = choice !== 'Cancel' ? this.choices[choice] : Costs.payHonor(30); // An Impossible cost, as we want to cancel this action 
        this.fate = choice;
        this.resolveCost(this.chosenCost, this.context, this.result);
        return true;
    }
}

module.exports = ChooseFate;


