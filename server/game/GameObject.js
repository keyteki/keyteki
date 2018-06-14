const uuid = require('uuid');
const _ = require('underscore');
const GameActions = require('./GameActions/GameActions');

class GameObject {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.id = this.name;
        this.type = '';
        this.facedown = false;
        this.uuid = uuid.v1();
        this.effects = [];
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    removeEffect(effect) {
        this.effects = this.effects.filter(e => e !== effect);
    }

    getEffects(type) {
        let filteredEffects = this.effects.filter(effect => effect.type === type);
        return filteredEffects.map(effect => effect.getValue(this));
    }

    sumEffects(type) {
        let filteredEffects = this.effects.filter(effect => effect.type === type);
        return filteredEffects.reduce((total, effect) => total + effect.getValue(this), 0);
    }

    anyEffect(type) {
        return this.effects.filter(effect => effect.type === type).length > 0;
    }

    mostRecentEffect(type) {
        return _.last(this.getEffects(type));
    }

    allowGameAction(actionType, context = this.game.getFrameworkContext()) {
        if(GameActions[actionType]) {
            return GameActions[actionType]().canAffect(this, context);
        }
        return this.checkRestrictions(actionType, context);
    }


    checkRestrictions(actionType, context) {
        return !this.getEffects('abilityRestrictions').some(restriction => restriction.isMatch(actionType, context));
    }

    isUnique() {
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

    hasTrait() {
        return false;
    }

    getTraits() {
        return [];
    }
            
    isFaction() {
        return false;
    }
            
    hasToken() {
        return false;
    }

    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            facedown: this.facedown,
            type: this.getType()
        };
    }

}

module.exports = GameObject;
