const _ = require('underscore');

const BaseCard = require('./basecard.js');
const SetupCardAction = require('./setupcardaction.js');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayCardAction = require('./playcardaction.js');

const StandardPlayActions = [
    new SetupCardAction(),
    new DynastyCardAction(),
    new PlayCardAction()
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.attachments = _([]);

        this.fate = 0;
        this.militaryskill = 0;
        this.politicalskill = 0;
        this.glory = 0;
        this.contributesToFavor = true;
        this.bowed = false;
        this.inConflict = false;
        this.inDanger = false;
        this.saved = false;
        this.readysDuringReadying = true;
        this.challengeOptions = {
            doesNotBowAs: {
                attacker: false,
                defender: false
            }
        };
        this.stealthLimit = 1;
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

    isBestow() {
        return !_.isUndefined(this.bestowMax);
    }

    isRenown() {
        return this.hasKeyword('renown');
    }

    isRestricted() {
        return this.hasKeyword('restricted');
    }

    isAncestral() {
        return this.hasKeyword('ancestral');
    }

    getCost() {
        return this.cardData.cost;
    }

    modifyMilitarySkill(amount, applying = true) {
        this.militarySkillModifier += amount;
        this.game.raiseMergedEvent('onCardMilitarySkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    modifyPoliticalSkill(amount, applying = true) {
        this.politicalSkillModifier += amount;
        this.game.raiseMergedEvent('onCardPoliticalSkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    getMilitarySkill(printed = false) {
        if(this.controller.phase === 'setup' || printed) {
            return this.cardData.militaryskill || undefined;
        }

        return Math.max(0, this.militarySkillModifier + (this.cardData.militaryskill || 0));
    }

    getPoliticalSkill(printed = false) {
        if(this.controller.phase === 'setup' || printed) {
            return this.cardData.politicalskill || undefined;
        }

        return Math.max(0, this.politicalSkillModifier + (this.cardData.politicalskill || 0));
    }

    needsStealthTarget() {
        return this.isStealth() && !this.stealthTarget;
    }

    canUseStealthToBypass(targetCard) {
        return this.isStealth() && targetCard.canBeBypassedByStealth();
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
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(_.filter(this.abilities.actions, action => !action.allowMenu()));
    }

    play(player) {
        super.play();
    }

    leavesPlay() {
        this.kneeled = false;
        this.power = 0;
        this.inChallenge = false;

        super.leavesPlay();
    }

    resetForConflict() {
        this.stealth = false;
        this.stealthTarget = undefined;
        this.inConflict = false;
    }

    canDeclareAsAttacker(challengeType) {
        return this.allowGameAction('declareAsAttacker') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsDefender(challengeType) {
        return this.allowGameAction('declareAsDefender') && this.canDeclareAsParticipant(challengeType);
    }

    canDeclareAsParticipant(challengeType) {
        return (
            this.canParticipateInChallenge() &&
            this.location === 'play area' &&
            !this.stealth &&
            (!this.bowed || this.challengeOptions.canBeDeclaredWhileBowing) &&
            (this.hasIcon(challengeType) || this.challengeOptions.canBeDeclaredWithoutIcon)
        );
    }

    canParticipateInChallenge() {
        return this.allowGameAction('participateInChallenge');
    }

    canBeBypassedByStealth() {
        return !this.isStealth() && this.allowGameAction('bypassByStealth');
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBeMarshaled() {
        return this.allowGameAction('marshal');
    }

    canBePlayed() {
        return this.allowGameAction('play');
    }

    markAsInDanger() {
        this.inDanger = true;
    }

    markAsSaved() {
        this.inDanger = false;
        this.saved = true;
    }

    clearDanger() {
        this.inDanger = false;
        this.saved = false;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            baseSkill: _.isNull(this.cardData.skill) ? 0 : this.cardData.skill,
            iconsAdded: this.getIconsAdded(),
            iconsRemoved: this.getIconsRemoved(),
            inChallenge: this.inChallenge,
            inDanger: this.inDanger,
            bowed: this.bowed,
            saved: this.saved,
            militaryskill: !_.isNull(this.cardData.militaryskill) ? this.getMilitarySkill() : 0,
            politicalskill: !_.isNull(this.cardData.politicalskill) ? this.getPoliticalSkill() : 0,
            stealth: this.stealth
        });
    }
}

module.exports = DrawCard;
