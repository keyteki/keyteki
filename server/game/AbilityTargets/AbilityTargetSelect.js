const _ = require('underscore');
const SelectChoice = require('./SelectChoice.js');

class AbilityTargetSelect {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        for(const key of Object.keys(properties.choices)) {
            if(typeof properties.choices[key] !== 'function' && !Array.isArray(properties.choices[key])) {
                properties.choices[key] = [properties.choices[key]];
            }
        }
        this.checkDependentTarget = context => true; // eslint-disable-line no-unused-vars
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.checkDependentTarget = context => this.hasLegalTarget(context);
        }
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        let keys = Object.keys(this.properties.choices);
        return keys.some(key => this.isChoiceLegal(key, context));
    }

    isChoiceLegal(key, context) {
        let choice = this.properties.choices[key];
        if(typeof choice === 'function') {
            return choice(context);
        }
        let contextCopy = context.copy();
        contextCopy.selects[this.name] = new SelectChoice(key);
        if(this.name === 'target') {
            contextCopy.select = key;
        }
        return context.ability.canPayCosts(contextCopy) && this.checkDependentTarget(contextCopy) &&
               choice.some(gameAction => gameAction.hasLegalTarget(contextCopy));
    }

    getGameAction(context) {
        let choice = this.properties.choices[context.selects[this.name].choice];
        if(typeof choice !== 'function') {
            return choice.filter(gameAction => gameAction.hasLegalTarget(context));
        }
        return [];
    }

    getAllLegalTargets(context) {
        return Object.keys(this.properties.choices).filter(key => this.isChoiceLegal(key, context));
    }

    resolve(context, noCostsFirstButton = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: 'select' };
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = Object.keys(this.properties.choices).filter(key => (
            this.isChoiceLegal(key, context)
        ));
        let handlers = _.map(choices, choice => {
            return (() => {
                result.resolved = true;
                result.value = choice;
                context.selects[this.name] = new SelectChoice(choice);
            });
        });
        if(this.properties.player !== 'opponent' && context.stage === 'pretarget') {
            if(!noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => result.costsFirst = true);
            }
            choices.push('Cancel');
            handlers.push(() => result.resolved = true);
        }
        if(handlers.length === 1) {
            handlers[0]();
        } else if(handlers.length > 1) {
            let waitingPromptTitle = '';
            if(context.stage === 'pretarget') {
                if(context.ability.abilityType === 'action') {
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
                handlers: handlers
            });
        }
        return result;
    }

    checkTarget(context) {
        return this.isChoiceLegal(context.selects[this.name].choice, context);
    }
}

module.exports = AbilityTargetSelect;
