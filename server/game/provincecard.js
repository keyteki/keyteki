const _ = require('underscore');

const BaseCard = require('./basecard.js');

class ProvinceCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.strengthModifier = 0;
        this.isProvince = true;
        this.isBroken = false;
        // This is specifically for Public Forum, may want to consider
        // a list of statuses if this becomes a more common design space
        this.hasHonorToken = false;
        this.menu = _([{ command: 'break', text: 'Break/unbreak this province' }, { command: 'hide', text: 'Flip face down' }]);
    }

    getStrength() {
        return this.cardData.strength + this.strengthModifier + this.getDynastyOrStrongholdCardModifier();
    }

    getDynastyOrStrongholdCardModifier() {
        let province = this.controller.getSourceList(this.location);
        let card = province.find(card => card !== this);
        if(card) {
            return card.getProvinceStrengthBonus();
        }
        return 0;
    }

    getElement() {
        return this.cardData.element;
    }

    modifyProvinceStrength(amount, applying = true) {
        this.strengthModifier += amount;
        this.game.raiseEvent('onProvinceStrengthChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    flipFaceup() {
        this.facedown = false;
    }

    breakProvince() {
        this.isBroken = true;
    }

    canTriggerAbilities() {
        if(!this.location.includes('province') || this.facedown) {
            return false;
        }
        return super.canTriggerAbilities();
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            isProvince: this.isProvince,
            strength: this.getStrength(),
            isBroken: this.isBroken
        });
    }

}

module.exports = ProvinceCard;
