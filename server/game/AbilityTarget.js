const _ = require('underscore');

const CardSelector = require('./CardSelector.js');

class AbilityTarget {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
        this.selector = CardSelector.for(properties);
    }

    canResolve(context) {
        return this.selector.hasEnoughTargets(context);
    }

    resolve(context) {
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null };
        let promptProperties = {
            context: context,
            source: context.source,
            selector: this.selector,
            onSelect: (player, card) => {
                result.resolved = true;
                result.value = card;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            }
        };
        if(this.properties.mode === 'ring') {
            context.game.promptForRingSelect(context.player, _.extend(promptProperties, otherProperties));
            return result;
        } else if(this.properties.mode !== 'select') {
            context.game.promptForSelect(context.player, _.extend(promptProperties, otherProperties));
            return result;
        }
        otherProperties.choices = _.filter(_.keys(otherProperties.choices), key => otherProperties.choices[key]());
        otherProperties.handlers = _.map(otherProperties.choices, choice => {
            return (() => {
                result.resolved = true;
                result.value = choice;
            });
        });
        let player = context.player.opponent;
        if(otherProperties.player === 'self') {
            otherProperties.choices.push('Cancel');
            otherProperties.handlers.push(() => result.resolved = true);
            player = context.player;
        }
        context.game.promptWithHandlerMenu(player, _.extend(promptProperties, otherProperties));
        return result;
    }
}

module.exports = AbilityTarget;
