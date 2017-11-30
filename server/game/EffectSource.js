const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');

class EffectSource {
    constructor(game, name = 'Framework effect') {
        this.game = game;
        this.name = name;
        this.id = this.name;
        this.factions = {};
        this.traits = {};
        this.type = '';
    }

    isUnique() {
        return false;
    }

    isBlank() {
        return false;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return null;
    }

    hasKeyword() {
        return false;
    }

    hasTrait(trait) {
        let traitCount = this.traits[trait.toLowerCase()] || 0;
        return traitCount > 0;
    }

    getTraits() {
        return _.keys(_.omit(this.traits, trait => trait < 1));
    }
            
    isFaction(faction) {
        return !!this.factions[faction.toLowerCase()];
    }
            
    hasToken() {
        return false;
    }
            
    /**
     * Applies an immediate effect which lasts until the end of the current
     * duel.
     */
    untilEndOfDuel(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfDuel', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the current 
     * conflict. Per game rules this duration is outside of the phase.
     */
    atEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'custom', location: 'any' }, properties));
    }

    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            type: this.getType()
        };
    }

}

module.exports = EffectSource;
