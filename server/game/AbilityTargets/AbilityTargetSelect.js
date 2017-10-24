const _ = require('underscore');

class AbilityTargetSelect {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return _.any(this.properties.choices, condition => condition(context));
    }

    resolve(context, pretarget = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false };
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(pretarget) {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = _.filter(_.keys(this.properties.choices), key => this.properties.choices[key]());
        let handlers = _.map(this.properties.choices, choice => {
            return (() => {
                result.resolved = true;
                result.value = choice;
            });
        });
        if(this.properties.player !== 'opponent' && pretarget) {
            choices.push('Pay costs first');
            handlers.push(() => result.costsFirst = true);
            choices.push('Cancel');
            handlers.push(() => result.resolved = true);
        }
        context.game.promptWithHandlerMenu(player, {
            activePromptTitle: promptTitle,
            context: context,
            source: context.source,
            choices: choices,
            handlers: handlers
        });
        return result;
    }
    
    checkTarget(context) {
        return this.properties.choices[context.targets[this.name]](context);
    }
}

module.exports = AbilityTargetSelect;
