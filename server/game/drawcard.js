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
        this.militaryskill = null;
        this.politicalskill = null;
        this.glory = 0;
        this.contributesToFavor = true;
        this.bowed = false;
        this.inConflict = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.readysDuringReadying = true;
        this.challengeOptions = {
            doesNotBowAs: {
                attacker: false,
                defender: false
            }
        };
        this.stealthLimit = 1;

        if(cardData.deck === 'conflict') {
            this.isConflict = true;
        } else if(cardData.deck === 'dynasty') {
            this.isDynasty = true;
        }
    }

    isLimited() {
        return this.hasKeyword('Limited') || this.hasPrintedKeyword('Limited');
    }

    isRestricted() {
        return this.hasKeyword('restricted');
    }

    isAncestral() {
        return this.hasKeyword('ancestral');
    }

    hasSincerity() {
        return this.hasKeyword('sincerity');
    }

    hasPride() {
        return this.hasKeyword('pride');
    }

    getCost() {
        return this.cardData.cost;
    }

    getFate() {
        return this.fate;
    }

    modifySkill(amount, type, applying = true) {
        /**
         * Direct the skill modification to the correct sub function.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {string}   type - The type of the skill; military or political
         * @param  {boolean}  applying -  [description]
         */
        if(type === 'military') {
            this.modifyMilitarySkill(amount, applying);
        } else if(type === 'political') {
            this.modifyPoliticalSkill(amount, applying);
        }
    }

    getSkill(type, printed = false) {
        /**
         * Direct the skill query to the correct sub function.
         * @param  {string} type - The type of the skill; military or political
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The chosen skill value
         */
        if(type === 'military') {
            return this.getMilitarySkill(printed);
        } else if(type === 'political') {
            return this.getPoliticalSkill(printed);
        }
    }    

    modifyMilitarySkill(amount, applying = true) {
        /**
         * Modify the military skill.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {boolean}  applying -  [description]
         */
        this.militarySkillModifier += amount;
        this.game.raiseMergedEvent('onCardMilitarySkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    modifyPoliticalSkill(amount, applying = true) {
        /**
         * Modify the political skill.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {boolean}  applying -  [description]
         */
        this.politicalSkillModifier += amount;
        this.game.raiseMergedEvent('onCardPoliticalSkillChanged', {
            card: this,
            amount: amount,
            applying: applying
        });
    }

    getMilitarySkill(printed = false) {
        /**
         * Get the military skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The military skill value
         */
        if(this.controller.phase === 'setup' || printed) {
            return this.cardData.militaryskill || undefined;
        }

        return Math.max(0, this.militarySkillModifier + (this.cardData.militaryskill || 0));
    }

    getPoliticalSkill(printed = false) {
        /**
         * Get the political skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The political skill value
         */
        if(this.controller.phase === 'setup' || printed) {
            return this.cardData.politicalskill || undefined;
        }

        return Math.max(0, this.politicalSkillModifier + (this.cardData.politicalskill || 0));
    }

    modifyFate(fate) {
        /**
         * @param  {integer} fate - the amount of fate to modify this card's fate total by
         */
        var oldFate = this.fate;

        this.fate += fate;

        if(this.fate < 0) {
            this.fate = 0;
        }

        this.game.raiseEvent('onCardFateChanged', this, this.fate - oldFate);

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
        this.bowed = false;
        this.inConflict = false;

        super.leavesPlay();
    }

    resetForConflict() {
        //this.stealth = false;
        //this.stealthTarget = undefined;
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

    canParticipateInConflict() {
        return this.allowGameAction('participateInChallenge');
    }

    canBeKilled() {
        return this.allowGameAction('kill');
    }

    canBePlayed() {
        return this.allowGameAction('play');
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            inConflict: this.inConflict,
            bowed: this.bowed,
            saved: this.saved,
            militaryskill: this.cardData.militaryskill,
            politicalskill: this.cardData.politicalskill,
            stealth: this.stealth
        });
    }
}

module.exports = DrawCard;
