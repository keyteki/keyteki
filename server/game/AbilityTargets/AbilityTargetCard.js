const _ = require('underscore');

const CardSelector = require('../CardSelector.js');

class AbilityTargetCard {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
        for(let gameAction of this.properties.gameAction) {
            gameAction.getDefaultTargets = context => context.targets[name];
        }
        this.selector = this.getSelector(properties);
    }

    getSelector(properties) {
        let cardCondition = (card, context) => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = card;
            if(this.name === 'target') {
                contextCopy.target = card;
            }
            if(context.stage === 'pretarget' && !context.ability.canPayCosts(contextCopy)) {
                return false;
            }
            return (!properties.cardCondition || properties.cardCondition(card, contextCopy)) &&
                   (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(contextCopy)));
        };
        return CardSelector.for(Object.assign({}, properties, { cardCondition: cardCondition}));
    }

    canResolve(context) {
        if(this.properties.dependsOn) {
            let dependsOnTarget = context.ability.targets.find(target => target.name === this.properties.dependsOn);
            return dependsOnTarget.getContextsForDependentTargets(context).some(targetContext => this.selector.hasEnoughTargets(targetContext));
        }
        // check for a legal target
        return this.selector.hasEnoughTargets(context);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    getContextsForDependentTargets(context) {
        return this.getAllLegalTargets(context).map(target => {
            let contextCopy = context.copy();
            contextCopy.targets[this.name] = target;
            return contextCopy;
        });
    }

    getAllLegalTargets(context) {
        if(this.properties.dependsOn) {
            let dependsOnTarget = context.ability.targets.find(target => target.name === this.properties.dependsOn);
            return dependsOnTarget.getContextsForDependentTargets(context).some(targetContext => this.selector.getAllLegalTargets(targetContext));            
        }
        return this.selector.getAllLegalTargets(context);
    }

    resolve(context, noCostsFirstButton = false) {
        let otherProperties = _.omit(this.properties, 'cardCondition');
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: this.properties.mode };
        let player = context.player;
        if(this.getAllLegalTargets(context).length === 0) {
            result.resolved = true;
            return result;
        }
        if(this.properties.player && this.properties.player === 'opponent') {
            if(context.stage === 'pretarget') {
                result.costsFirst = true;
                return result;
            }
            player = player.opponent;
        }
        let buttons = [];
        let waitingPromptTitle = '';
        if(this.properties.optional) {
            buttons.push({ text: 'No more targets', arg: 'noMoreTargets' });
        }
        if(context.stage === 'pretarget') {
            if(!noCostsFirstButton) {
                buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            }
            buttons.push({ text: 'Cancel', arg: 'cancel' });
            if(context.ability.abilityType === 'action') {
                waitingPromptTitle = 'Waiting for opponent to take an action or pass';
            } else {
                waitingPromptTitle = 'Waiting for opponent';
            }
        }
        let promptProperties = {
            waitingPromptTitle: waitingPromptTitle,
            context: context,
            selector: this.selector,
            buttons: buttons,
            onSelect: (player, card) => {
                result.resolved = true;
                result.value = card;
                context.targets[this.name] = card;
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
        context.game.promptForSelect(player, Object.assign(promptProperties, otherProperties));
        return result;
    }

    checkTarget(context) {
        if(this.properties.optional || context.targets[this.name] === 'noMoreTargets') {
            return true;
        } else if(!context.targets[this.name]) {
            return false;
        }
        let cards = context.targets[this.name];
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return (cards.every(card => this.selector.canTarget(card, context)) &&
                this.selector.hasEnoughSelected(cards) &&
                !this.selector.hasExceededLimit(cards));
    }
}

module.exports = AbilityTargetCard;
