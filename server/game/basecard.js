const uuid = require('node-uuid');
const _ = require('underscore');

class BaseCard {
    constructor(owner, cardData) {
        this.owner = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.code = cardData.code;
        this.name = cardData.name;
        this.facedown = false;
        this.inPlay = false;
        this.blankCount = 0;

        this.tokens = {};

        this.menu = _([]);
    }

    hasKeyword(keyword) {
        if(!this.cardData.text || this.isBlank()) {
            return false;
        }

        return this.cardData.text.toLowerCase().indexOf(keyword.toLowerCase() + '.') !== -1;
    }

    hasTrait(trait) {
        return this.cardData.traits && this.cardData.traits.indexOf(trait + '.') !== -1;
    }

    leavesPlay() {
        this.inPlay = false;

        this.menu = _([]);
    }

    modifyDominance(player, strength) {
        return strength;
    }

    canPlay() {
        return true;
    }

    canReduce() {
        return false;
    }

    getInitiative() {
        return 0;
    }

    getIncome() {
        return 0;
    }

    getReserve() {
        return 0;
    }

    getFaction() {
        return this.cardData.faction_code;
    }

    getMenu() {
        return this.menu.isEmpty() ? undefined : this.menu.value();
    }

    isUnique() {
        return this.cardData.is_unique;
    }

    isBlank() {
        return this.blankCount > 0;
    }

    getType() {
        return this.cardData.type_code;
    }

    reduce(card, cost) {
        return cost;
    }

    modifyClaim(player, type, claim) {
        return claim;
    }
    
    setBlank() {
        this.blankCount++;
    }

    clearBlank() {
        this.blankCount--;
    }

    addToken(type, number) {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    removeToken(type, number) {
        this.tokens[type] += number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        return isActivePlayer || (!this.facedown && !hideWhenFaceup) ? {
            code: this.cardData.code,
            facedown: this.facedown,
            menu: this.getMenu(),
            name: this.cardData.name,
            type: this.cardData.type_code,
            uuid: this.uuid
        } : { facedown: true };
    }
}

module.exports = BaseCard;
