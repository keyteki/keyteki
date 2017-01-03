const _ = require('underscore');

const BaseCard = require('./basecard.js');

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.dupes = _([]);
        this.attachments = _([]);
        this.icons = {
            military: 0,
            intrigue: 0,
            power: 0
        };

        if(cardData.is_military) {
            this.icons.military++;
        }

        if(cardData.is_intrigue) {
            this.icons.intrigue++;
        }

        if(cardData.is_power) {
            this.icons.power++;
        }

        this.power = 0;
        this.strengthModifier = 0;
        this.kneeled = false;

        this.renownCount = this.hasKeyword('Renown') ? 1 : 0;

        this.wasAmbush = false;
    }

    addDuplicate(card) {
        this.dupes.push(card);
        card.location = 'play area';
    }

    removeDuplicate() {
        var firstDupe = _.first(this.dupes.filter(dupe => {
            return dupe.owner === this.controller;
        }));

        this.dupes = _(this.dupes.reject(dupe => {
            return dupe === firstDupe;
        }));
        
        return firstDupe;
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

    isAmbush() {
        return !_.isUndefined(this.ambushCost);
    }

    isLoyal() {
        return this.cardData.is_loyal;
    }

    isRenown() {
        return this.hasKeyword('renown');
    }

    hasIcon(icon) {
        return this.icons[icon] > 0;
    }

    getCost() {
        return this.cardData.cost;
    }

    getAmbushCost() {
        return this.ambushCost;
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
        if(this.controller.phase === 'setup') {
            return this.cardData.strength || undefined;
        }

        return this.strengthModifier + (this.cardData.strength || 0);
    }

    setIcon(icon) {
        this.icons[icon]++;
    }

    clearIcon(icon) {
        this.icons[icon]--;
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
        if(this.getType() !== 'attachment' || card.allowedAttachmentTrait === 'none') {
            return false;
        }

        if(card.allowedAttachmentTrait !== 'any') {
            return this.hasTrait(card.allowedAttachmentTrait);
        }

        return true;
    }

    attach() {
    }

    play(player, isAmbush) {
        this.wasAmbush = isAmbush;

        super.play();
    }

    onClick() {
        return false;
    }

    leavesPlay() {
        this.kneeled = false;
        this.strengthModifier = 0;
        this.power = 0;
        this.wasAmbush = false;

        super.leavesPlay();
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
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(isActivePlayer, hideWhenFaceup);
            }),
            kneeled: this.kneeled,
            power: this.power,
            strength: !_.isNull(this.cardData.strength) ? this.getStrength() : 0,
            baseStrength: this.cardData.strength
        });
    }
}

module.exports = DrawCard;
