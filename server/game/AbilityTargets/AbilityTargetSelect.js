import _ from 'underscore';
import SelectChoice from './SelectChoice.js';
import AbilityTarget from './AbilityTarget.js';
import Optional from '../optional.js';

class AbilityTargetSelect extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);

        for (const key of Object.keys(properties.choices)) {
            if (
                typeof properties.choices[key] !== 'function' &&
                !Array.isArray(properties.choices[key])
            ) {
                properties.choices[key] = [properties.choices[key]];
            }
        }
    }

    getDependsOnCondition(target) {
        let keys = Object.keys(this.properties.choices);
        let key = keys.find((key) => target.name.startsWith(key));
        if (key) {
            return (context) => context.selects[this.name].choice === key;
        }
        return super.getDependsOnCondition(target);
    }

    hasLegalTarget(context) {
        let keys = Object.keys(this.properties.choices);
        return (
            keys.some((key) => this.isChoiceLegal(key, context)) && super.hasLegalTarget(context)
        );
    }

    isChoiceLegal(key, context) {
        let contextCopy = context.copy();
        contextCopy.selects[this.name] = new SelectChoice(key);
        if (this.name === 'target') {
            contextCopy.select = key;
        }

        if (context.stage === 'pretarget') {
            return false;
        }

        let choice = this.properties.choices[key];
        if (typeof choice === 'function') {
            return choice(contextCopy);
        }

        return true;
    }

    getGameAction(context) {
        if (!context.selects[this.name]) {
            return [];
        }

        let choice = this.properties.choices[context.selects[this.name].choice];

        if (typeof choice !== 'function') {
            return choice.filter((gameAction) => gameAction.hasLegalTarget(context));
        }

        return [];
    }

    getAllLegalTargets(context) {
        return Object.keys(this.properties.choices).filter((key) =>
            this.isChoiceLegal(key, context)
        );
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

        let promptTitle = this.properties.activePromptTitle || 'Select one';
        let choices = Object.keys(this.properties.choices).filter((key) =>
            this.isChoiceLegal(key, context)
        );
        let handlers = _.map(choices, (choice) => {
            return () => {
                context.selects[this.name] = new SelectChoice(choice);
                if (this.name === 'target') {
                    context.select = choice;
                }
                context.game.addMessage("{0} chooses option '{1}'", player, choice);
            };
        });

        if (Optional.EvalOptional(context, this.properties.optional)) {
            choices.push('Done');
            handlers.push(() => (targetResults.cancelled = true));
        }

        if (this.properties.player !== 'opponent' && context.stage === 'pretarget') {
            if (!targetResults.noCostsFirstButton) {
                choices.push('Pay costs first');
                handlers.push(() => (targetResults.payCostsFirst = true));
            }

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
                handlers: handlers
            });
        }
    }

    checkTarget(context) {
        return (
            context.selects[this.name] &&
            this.isChoiceLegal(context.selects[this.name].choice, context) &&
            super.checkTarget(context)
        );
    }
}

export default AbilityTargetSelect;
