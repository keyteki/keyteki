const SelectChoice = require('./SelectChoice.js');

class AbilityTargetHouse {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.houses = properties.houses || ['brobnar', 'dis', 'logos', 'mars', 'sanctum', 'shadows', 'untamed'];
        this.dependentTarget = null;
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.dependentTarget = this;
        }
    }

    canResolve() {
        return !!this.properties.dependsOn || this.hasLegalTarget();
    }

    hasLegalTarget() {
        return this.houses.length;
    }

    getGameAction() {
        return [];
    }

    getAllLegalTargets() {
        return this.houses;
    }

    resolve(context, targetResults) {
        if(targetResults.cancelled || targetResults.payCostsFirst || targetResults.delayTargeting) {
            return;
        }
        let player = context.player;
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                targetResults.delayTargeting = this;
                return;
            }
            player = player.opponent;
        }
        let promptTitle = this.properties.activePromptTitle || 'Choose a house';
        let choices = this.houses;
        let handlers = choices.map(choice => {
            return (() => {
                context.houses[this.name] = new SelectChoice(choice);
                if(this.name === 'target') {
                    context.house = choice;
                }
            });
        });
        if(this.properties.player !== 'opponent' && context.stage === 'pretarget') {
            choices.push('Cancel');
            handlers.push(() => targetResults.cancelled = true);
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
    }

    checkTarget(context) {
        return context.houses[this.name] && (!this.dependentTarget || this.dependentTarget.checkTarget(context));
    }
}

module.exports = AbilityTargetHouse;
