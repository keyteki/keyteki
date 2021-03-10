const Constants = require('../../constants.js');
const SelectChoice = require('./SelectChoice.js');
const AbilityTarget = require('./AbilityTarget.js');

class AbilityTargetHouse extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.houses = properties.houses || Constants.Houses;
    }

    getHouses(context) {
        let houses = this.houses;
        if (typeof houses === 'function') {
            houses = houses(context);
        }

        if (!Array.isArray(houses)) {
            return [houses];
        }

        return houses;
    }

    hasLegalTarget(context) {
        return !!this.getHouses(context).length;
    }

    getAllLegalTargets(context) {
        return this.getHouses(context);
    }

    resolve(context, targetResults) {
        if (
            targetResults.cancelled ||
            targetResults.payCostsFirst ||
            targetResults.delayTargeting
        ) {
            return;
        }

        let player = context.player;
        if (this.properties.player && this.properties.player === 'opponent') {
            if (context.stage === 'pretarget') {
                targetResults.delayTargeting = this;
                return;
            }

            player = player.opponent;
        }

        let promptTitle = this.properties.activePromptTitle || 'Choose a house';
        let houses = this.getHouses(context);
        let choices = houses.map((house) => {
            return { text: house };
        });
        let handlers = houses.map((choice) => {
            return () => {
                context.houses[this.name] = new SelectChoice(choice);
                if (this.name === 'target') {
                    context.house = choice;
                }
            };
        });
        if (this.properties.player !== 'opponent' && context.stage === 'pretarget') {
            choices.push('Cancel');
            handlers.push(() => (targetResults.cancelled = true));
        }

        if (handlers.length === 1) {
            handlers[0]();
        } else if (handlers.length > 1) {
            let waitingPromptTitle = '';
            if (context.stage === 'pretarget') {
                if (context.ability.abilityType === 'action') {
                    waitingPromptTitle = 'Waiting for opponent to take an action or pass';
                } else {
                    waitingPromptTitle = 'Waiting for opponent';
                }
            }

            context.game.promptWithHandlerMenu(player, {
                waitingPromptTitle: waitingPromptTitle,
                activePromptTitle: promptTitle,
                context: context,
                source: this.properties.source || context.source,
                choices: choices,
                handlers: handlers,
                controls: [{ type: 'house-select', houses: houses }]
            });
        }
    }

    checkTarget(context) {
        return context.houses[this.name] && super.checkTarget(context);
    }
}

module.exports = AbilityTargetHouse;
