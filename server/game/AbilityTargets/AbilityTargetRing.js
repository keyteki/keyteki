const _ = require('underscore');

class AbilityTargetCard {
    constructor(name, properties) {
        this.name = name;
        this.properties = properties;
    }

    canResolve(context) {
        return _.any(context.game.rings, ring => this.properties.ringCondition(ring));
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
        let buttons = [];
        if(this.properties.optional) {
            buttons.push({ text: 'No more targets', arg: 'noMoreTargets' });
        }
        if(pretarget) {
            buttons.push({ text: 'Pay costs first', arg: 'costsFirst' });
            buttons.push({ text: 'Cancel', arg: 'done' });
        } else {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        let promptProperties = {
            context: context,
            source: context.source,
            buttons: buttons,
            onSelect: (player, ring) => {
                result.resolved = true;
                result.value = ring;
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
        return this.properties.ringCondition(context.targets[this.name]);
    }
}

module.exports = AbilityTargetCard;
