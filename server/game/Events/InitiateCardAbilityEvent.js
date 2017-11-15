const _ = require('underscore');
const Event = require('./Event.js');

class InitiateCardAbilityEvent extends Event {
    constructor(params, handler) {
        super('onCardAbilityInitiated', params, handler);
        this.cardTargets = _.flatten(_.values(this.context.targets));
        this.ringTargets = _.flatten(_.values(this.context.rings));
        this.selectTargets = _.flatten(_.values(this.context.selects));
        this.allTargets = this.cardTargets.concat(this.ringTargets.concat(this.selectTargets));
    }
}

module.exports = InitiateCardAbilityEvent;
