const checkRestrictions = {
    copiesOfDiscardEvents: context =>
        context.source.type === 'event' && context.player.conflictDiscardPile.any(card => card.name === context.source.name),
    events: context => context.source.type === 'event',
    nonSpellEvents: context => context.source.type === 'event' && !context.source.hasTrait('spell'),
    opponentsCardEffects: (context, player) =>
        context.player && context.player === player.opponent && context.ability.isCardAbility(),
    opponentsEvents: (context, player) =>
        context.player && context.player === player.opponent && context.source.type === 'event',
    opponentsRingEffects: (context, player) =>
        context.player && context.player === player.opponent && context.source.type === 'ring',
    source: (context, player, source) => context.source === source
};
class CannotRestriction {
    constructor(properties) {
        if(typeof properties === 'string') {
            this.type = properties;
        } else {
            this.type = properties.cannot;
            this.restriction = properties.restricts;
            this.player = properties.player;
            this.source = properties.source;
        }
    }

    isMatch(type, abilityContext) {
        return (!this.type || this.type === type) && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if(!this.restriction) {
            return true;
        } else if(!checkRestrictions[this.restriction]) {
            return context.source.hasTrait(this.restriction);
        } else if(!context) {
            return false; // throw Error here?
        }
        let player = this.player || this.source && this.source.controller;
        return checkRestrictions[this.restriction](context, player, this.source);
    }
}

module.exports = CannotRestriction;
