const _ = require('underscore');

const BaseCard = require('./basecard.js');
const SetupCardAction = require('./setupcardaction.js');

const StandardPlayActions = [
    new SetupCardAction()
];

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
        this.contributesToDominance = true;
        this.kneeled = false;
        this.inChallenge = false;
        this.wasAmbush = false;
        this.challengeOptions = {
            allowAsAttacker: true,
            allowAsDefender: true,
            doesNotKneelAs: {
                attacker: false,
                defender: false
            }
        };
    }

    addDuplicate(card) {
        this.dupes.push(card);
        card.moveTo('duplicate');
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
        return this.hasKeyword('Limited') || this.hasPrintedKeyword('Limited');
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
        return this.icons[icon.toLowerCase()] > 0;
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

    getStrength(printed = false) {
        if(this.controller.phase === 'setup' || printed) {
            return this.cardData.strength || undefined;
        }

        return Math.max(0, this.strengthModifier + (this.cardData.strength || 0));
    }

    getIconsAdded() {
        var icons = [];

        if(this.hasIcon('military') && !this.cardData.is_military) {
            icons.push('military');
        }

        if(this.hasIcon('intrigue') && !this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(this.hasIcon('power') && !this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    getIconsRemoved() {
        var icons = [];

        if(!this.hasIcon('military') && this.cardData.is_military) {
            icons.push('military');
        }

        if(!this.hasIcon('intrigue') && this.cardData.is_intrigue) {
            icons.push('intrigue');
        }

        if(!this.hasIcon('power') && this.cardData.is_power) {
            icons.push('power');
        }

        return icons;
    }

    addIcon(icon) {
        this.icons[icon]++;
    }

    removeIcon(icon) {
        this.icons[icon]--;
    }

    modifyPower(power) {
        var oldPower = this.power;

        this.power += power;

        if(this.power < 0) {
            this.power = 0;
        }

        this.game.raiseEvent('onCardPowerChanged', this, this.power - oldPower);

        this.game.checkWinCondition(this.controller);
    }

    needsStealthTarget() {
        return this.isStealth() && !this.stealthTarget;
    }

    canUseStealthToBypass(targetCard) {
        if(!this.isStealth() || targetCard.isStealth()) {
            return false;
        }

        return true;
    }

    useStealthToBypass(targetCard) {
        if(!this.canUseStealthToBypass(targetCard)) {
            return false;
        }

        targetCard.stealth = true;
        this.stealthTarget = targetCard;

        return true;
    }

    clearBlank() {
        super.clearBlank();
        this.attachments.each(attachment => {
            if(!this.allowAttachment(attachment)) {
                this.controller.discardCard(attachment, false);
            }
        });
    }

    allowAttachment(attachment) {
        return (
            this.isBlank() ||
            this.allowedAttachmentTrait === 'any' ||
            this.allowedAttachmentTrait !== 'none' && attachment.hasTrait(this.allowedAttachmentTrait)
        );
    }

    canAttach(player, card) {
        if(this.getType() !== 'attachment') {
            return false;
        }

        return card.allowAttachment(this);
    }

    attach() {
        _.each(this.abilities.persistentEffects, effect => {
            this.game.addEffect(this, effect);
        });
    }

    getPlayActions() {
        return StandardPlayActions;
    }

    play(player, isAmbush) {
        this.wasAmbush = isAmbush;

        super.play();
    }

    leavesPlay() {
        this.kneeled = false;
        this.power = 0;
        this.wasAmbush = false;
        this.inChallenge = false;
        this.selected = this.opponentSelected = false;

        super.leavesPlay();
    }

    resetForChallenge() {
        this.stealth = false;
        this.stealthTarget = undefined;
        this.inChallenge = false;
    }

    canAddAsAttacker(challengeType) {
        return this.challengeOptions.allowAsAttacker && this.canAddAsParticipant(challengeType);
    }

    canAddAsDefender(challengeType) {
        return this.challengeOptions.allowAsDefender && this.canAddAsParticipant(challengeType);
    }

    canAddAsParticipant(challengeType) {
        return (
            this.location === 'play area' &&
            !this.stealth &&
            (!this.kneeled || this.challengeOptions.canBeDeclaredWhileKneeling) &&
            (this.hasIcon(challengeType) || this.challengeOptions.canBeDeclaredWithoutIcon)
        );
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        var baseSummary = super.getSummary(isActivePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(isActivePlayer, hideWhenFaceup);
            }),
            baseStrength: _.isNull(this.cardData.strength) ? 0 : this.cardData.strength,
            dupes: this.dupes.map(dupe => {
                if(dupe.dupes.size() !== 0) {
                    throw new Error('A dupe should not have dupes! ' + dupe.name);
                }

                return dupe.getSummary(isActivePlayer, hideWhenFaceup);
            }),
            iconsAdded: this.getIconsAdded(),
            iconsRemoved: this.getIconsRemoved(),
            inChallenge: this.inChallenge,
            kneeled: this.kneeled,
            power: this.power,
            strength: !_.isNull(this.cardData.strength) ? this.getStrength() : 0,
            stealth: this.stealth
        });
    }
}

module.exports = DrawCard;
