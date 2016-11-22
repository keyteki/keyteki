const _ = require('underscore');

const BaseCard = require('./basecard.js');

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dupes = _([]);
        this.attachments = _([]);
        this.icons = {};

        if(cardData.is_military) {
            this.icons.military = true;
        }

        if(cardData.is_intrigue) {
            this.icons.intrigue = true;
        }

        if(cardData.is_power) {
            this.icons.power = true;
        }

        this.power = 0;
        this.strengthModifier = 0;
        this.kneeled = false;
    }

    addDuplicate(card) {
        this.dupes.push(card);
    }

    isLimited() {
        return this.hasKeyword('Limited');
    }

    isStealth() {
        return this.hasKeyword('Stealth');
    }

    isTerminal() {
        return this.hasKeyword('Terminal');
    }

    hasIcon(icon) {
        return this.icons[icon];
    }

    getCost() {
        return this.cardData.cost;
    }

    getPower() {
        return this.power;
    }

    getIncome() {
        var income = super.getIncome();

        income = this.attachments.reduce((runningTotal, attachment) => {
            return runningTotal + attachment.getIncome();
        }, 0);

        return income;
    }

    getStrength() {
        return this.strengthModifier + this.cardData.strength;
    }

    needsStealthTarget() {
        return this.isStealth() && !this.stealthTarget;
    }

    useStealthToBypass(targetCard) {
        if(!this.isStealth() || targetCard.isStealth()) {
            return false;
        }

        targetCard.stealth = true;
        this.stealthTarget = targetCard;

        return true;
    }

    canAttach(player, card) {
        if(this.getType() !== 'attachment' || card.hasKeyword('No Attachments')) {
            return false;
        }

        return true;
    }

    attach() {
    }

    clicked() {
        return false;
    }

    leavesPlay() {
        this.kneeled = false;
    }

    resetForChallenge() {
        this.stealth = false;
        this.stealthTarget = undefined;
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        var baseSummary = super.getSummary(isActivePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            dupes: this.dupes.map(dupe => {
                return dupe.getSummary(isActivePlayer, hideWhenFaceup);
            }),
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(isActivePlayer, hideWhenFaceup);
            }),
            kneeled: this.kneeled,
            power: this.power,
            selected: isActivePlayer && this.selected,
            strength: this.cardData.strength ? this.getStrength() : undefined,
            baseStrength: this.cardData.strength
        });
    }
}

module.exports = DrawCard;
