const _ = require('underscore');

class AbilityTargetCard {
    constructor(name, properties) {
        this.name = name;
        this.properties = _.omit(properties, 'ringCondition');
        this.properties.ringCondition = (ring, context) => {
            let contextCopy = context.copy();
            contextCopy.rings[this.name] = ring;
            if(this.name === 'target') {
                contextCopy.ring = ring;
            }
            return (properties.gameAction.length === 0 || properties.gameAction.some(gameAction => gameAction.hasLegalTarget(context))) && 
                   properties.ringCondition(ring, context) && context.ability.canPayCosts(context);
        };
        for(let gameAction of this.properties.gameAction) {
            gameAction.getDefaultTargets = context => context.rings[name];
        }
    }

    canResolve(context) {
        return _.any(context.game.rings, ring => this.properties.ringCondition(ring, context));
    }

    getGameAction(context) {
        return this.properties.gameAction.filter(gameAction => gameAction.hasLegalTarget(context));
    }

    getContextsForDependentTargets(context) {
        return this.getAllLegalTargets(context).map(target => {
            let contextCopy = context.copy();
            contextCopy.rings[this.name] = target;
            return contextCopy;
        });
    }    

    getAllLegalTargets(context) {
        return _.filter(context.game.rings, ring => this.properties.ringCondition(ring, context));
    }

    resolve(context, noCostsFirstButton = false) {
        let result = { resolved: false, name: this.name, value: null, costsFirst: false, mode: 'ring' };
        let player = context.player;
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
            buttons: buttons,
            onSelect: (player, ring) => {
                result.resolved = true;
                result.value = ring;
                context.rings[this.name] = ring;
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
                }
                result.resolved = true;
                result.value = arg;
                return true;
            }
        };
        context.game.promptForRingSelect(player, _.extend(promptProperties, this.properties));
        return result;
    }
    
    checkTarget(context) {
        return this.properties.ringCondition(context.rings[this.name], context);
    }
}

module.exports = AbilityTargetCard;
