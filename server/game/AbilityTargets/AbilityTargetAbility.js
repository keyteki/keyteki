const CardSelector = require('../CardSelector.js');

class AbilityTargetAbility {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.selector = this.getSelector(properties);
        this.checkDependentTarget = context => true; // eslint-disable-line no-unused-vars
        if(this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(target => target.name === this.properties.dependsOn);
            dependsOnTarget.checkDependentTarget = context => this.hasLegalTarget(context);
        }
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let abilities = card.abilities.actions.concat(card.abilities.reactions).filter(ability => ability.printedAbility);
            return abilities.some(ability => {
                let contextCopy = context.copy();
                contextCopy.targetAbility = ability;
                if(context.stage === 'pretarget' && !context.ability.canPayCosts(contextCopy)) {
                    return false;
                }
                return properties.cardCondition(card, contextCopy) && this.checkDependentTarget(context) && 
                       properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy));
            });
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition}));
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        return this.selector.hasEnoughTargets(context);
    }

    getAllLegalTargets(context) {
        return this.selector.getAllLegalTargets(context);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    resolve(context) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: this.properties.mode };
        if(this.getAllLegalTargets(context).length === 0) {
            result.resolved = true;
            return result;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(context.stage === 'pretarget') {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            buttons: buttons,
            context: context,
            onSelect: (player, card) => {
                result.resolved = true;
                let ability = card.abilities.actions.find(action => action.printedAbility) || card.abilities.reactions.find(reaction => reaction.printedAbility);
                result.value = ability;
                context.targetAbility = ability;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'costsFirst') {
                    result.costsFirst = true;
                    return true;
                } else if(arg === 'cancel') {
                    result.resolved = true;
                    return true;
                }
                result.resolved = true;
                result.value = arg;
                return true;
            }
        };
        context.game.promptForSelect(context.player, Object.assign(promptProperties, this.properties));
        return result;
    }

    checkTarget(context) {
        if(!context.targetAbility) {
            return false;
        }
        return this.properties.cardType === context.targetAbility.card.type &&
               this.properties.cardCondition(context.targetAbility.card, context);
    }
}

module.exports = AbilityTargetAbility;
