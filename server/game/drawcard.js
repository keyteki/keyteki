const _ = require('underscore');

const BaseCard = require('./basecard.js');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayCardAction = require('./playcardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');
const CourtesyAbility = require('./KeywordAbilities/CourtesyAbility');
const PersonalHonorAbility = require('./KeywordAbilities/PersonalHonorAbility');
const PrideAbility = require('./KeywordAbilities/PrideAbility');
const SincerityAbility = require('./KeywordAbilities/SincerityAbility');

const StandardPlayActions = [
    new DynastyCardAction(),
    new PlayAttachmentAction(),
    new PlayCharacterAction(),
    new DuplicateUniqueAction(),
    new PlayCardAction()
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.attachments = _([]);
        this.parent = null;

        this.militarySkillModifier = 0;
        this.politicalSkillModifier = 0;
        this.baseMilitarySkill = cardData.military;
        this.basePoliticalSkill = cardData.political;
        this.militarySkillMultiplier = 1;
        this.politicalSkillMultiplier = 1;
        this.gloryModifier = 0;
        this.fate = 0;
        this.contributesToFavor = true;
        this.bowed = false;
        this.covert = false;
        this.inConflict = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.isHonored = false;
        this.isDishonored = false;
        this.readysDuringReadying = true;
        this.conflictOptions = {
            doesNotBowAs: {
                attacker: false,
                defender: false
            },
            cannotParticipateIn: {
                military: false,
                political: false
            }
        };
        this.covertLimit = 1;

        this.menu = _([
            { command: 'bow', text: 'Bow/Ready' },
            { command: 'honor', text: 'Honor' },
            { command: 'dishonor', text: 'Dishonor' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'move', text: 'Move into/out of conflict' },
            { command: 'control', text: 'Give control' }
        ]);

        if(cardData.side === 'conflict') {
            this.isConflict = true;
        } else if(cardData.side === 'dynasty') {
            this.isDynasty = true;
        }

        if(cardData.type === 'character') {
            if(cardData.military === undefined || cardData.military === null) {
                this.conflictOptions.cannotParticipateIn.military = true;
            }
            if(cardData.political === undefined || cardData.political === null) {
                this.conflictOptions.cannotParticipateIn.political = true;
            }
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PersonalHonorAbility(this.game, this));
            this.abilities.reactions.push(new PrideAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
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

    isCovert() {
        return this.hasKeyword('covert');
    }

    hasSincerity() {
        return this.hasKeyword('sincerity');
    }

    hasPride() {
        return this.hasKeyword('pride');
    }

    hasCourtesy() {
        return this.hasKeyword('courtesy');
    }

    getCost() {
        return this.cardData.cost;
    }

    getFate() {
        return this.fate;
    }
    
    allowGameAction(actionType, context = null) {
        if(actionType === 'break') {
            return false;
        } else if(actionType === 'dishonor') {
            if(this.location !== 'play area' || this.type !== 'character' || this.isDishonored || 
               (!super.allowGameAction('becomeDishonored', context) && !this.isHonored)) {
                return false;
            }
        } else if(actionType === 'honor' && (this.location !== 'play area' || this.type !== 'character' || this.isHonored)) {
            return false;
        } else if(actionType === 'bow' && (['event', 'holding'].includes(this.type) || this.location !== 'play area' || this.bowed)) {
            return false;
        } else if(actionType === 'ready' && (['event', 'holding'].includes(this.type) || this.location !== 'play area' || !this.bowed)) {
            return false;
        } else if(actionType === 'moveToConflict') {
            if(!this.game.currentConflict || this.isParticipating() || this.type !== 'character') {
                return false;
            }
            if(this.controller.isAttackingPlayer()) {
                if(!this.canParticipateAsAttacker()) {
                    return false;
                }
            } else if(!this.canParticipateAsDefender()) {
                return false;
            }
        } else if(actionType === 'sendHome' && !this.isParticipating()) {
            return false;
        } else if(actionType === 'putIntoConflict') {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!this.game.currentConflict || !context || !this.allowGameAction('putIntoPlay', context)) {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((context.player.isAttackingPlayer() && !this.allowGameAction('participateAsAttacker')) || 
                (context.player.isDefendingPlayer() && !this.allowGameAction('participateAsDefender'))) {
                return false;
            }
            // card cannot participate in this conflict type
            if(this.conflictOptions.cannotParticipateIn[this.game.currentConflict.conflictType]) {
                return false;
            }
        } else if(actionType === 'putIntoPlay') {
            if(this.location === 'play area' || this.facedown || !['character', 'attachment'].includes(this.type)) {
                return false;
            }
            if(this.isUnique() && this.game.allCards.any(card => (
                card.location === 'play area' &&
                card.name === this.name &&
                ((card.owner === context.player || card.controller === context.player) || (card.owner === this.owner)) &&
                card !== this
            ))) {
                return false;
            }
        } else if(actionType === 'removeFate' && (this.location !== 'play area' || this.fate === 0 || this.type !== 'character')) {
            return false;
        } else if(actionType === 'sacrifice' && ((['character', 'attachment'].includes(this.type) && this.location !== 'play area') || this.facedown)) {
            return false;
        } else if(['discardFromPlay', 'returnToHand', 'returnToDeck', 'takeControl', 'placeFate'].includes(actionType) && this.location !== 'play area') {
            return false;
        }
        return super.allowGameAction(actionType, context);
    }

    createSnapshot() {
        let clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = _(this.attachments.map(attachment => attachment.createSnapshot()));
        clone.blankCount = this.blankCount;
        clone.controller = this.controller;
        clone.factions = Object.assign({}, this.factions);
        clone.keywords = Object.assign({}, this.keywords);
        clone.bowed = this.bowed;
        clone.isHonored = this.isHonored;
        clone.isDishonored = this.isDishonored;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.fate = this.fate;
        clone.traits = Object.assign({}, this.traits);
        clone.militarySkillModifier = this.militarySkillModifier;
        clone.politicalSkillModifier = this.politicalSkillModifier;
        clone.baseMilitarySkill = this.baseMilitarySkill;
        clone.basePoliticalSkill = this.basePoliticalSkill;
        clone.militarySkillMultiplier = this.militarySkillMultiplier;
        clone.politicalSkillMultiplier = this.politicalSkillMultiplier;
        clone.gloryModifier = this.gloryModifier;
        clone.inConflict = this.inConflict;
        return clone;
    }

    modifySkill(amount, type) {
        /**
         * Direct the skill modification to the correct sub function.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {string}   type - The type of the skill; military or political
         */
        if(type === 'military') {
            this.modifyMilitarySkill(amount);
        } else if(type === 'political') {
            this.modifyPoliticalSkill(amount);
        }
    }

    modifyGlory(amount) {
        /**
         * Modify glory.
         * @param  {integer} amount - The amount to modify glory by.
         */
        this.gloryModifier += amount;
    }

    modifyMilitarySkillMultiplier(amount) {
        this.militarySkillMultiplier *= amount;
    }

    modifyPoliticalSkillMultiplier(amount) {
        this.politicalSkillMultiplier *= amount;
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

    getGlory(printed = false) {
        /**
         * Get this card's glory.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @return {integer} The military skill value
         */
        if(printed) {
            return this.cardData.glory;
        }

        if(this.cardData.glory !== null && this.cardData.glory !== undefined) {
            return Math.max(0, this.cardData.glory + this.gloryModifier);
        }

        return null;

    }
    
    getProvinceStrengthBonus() {
        if(this.cardData.strength_bonus && !this.facedown) {
            return parseInt(this.cardData.strength_bonus);
        }
        return 0;
    }

    modifyMilitarySkill(amount) {
        /**
         * Modify the military skill.
         * @param  {integer} amount - The amount to modify the skill by.
         */
        this.militarySkillModifier += amount;
    }

    modifyPoliticalSkill(amount) {
        /**
         * Modify the political skill.
         * @param  {integer} amount - The amount to modify the skill by.
         * @param  {boolean}  applying -  [description]
         */
        this.politicalSkillModifier += amount;
    }

    modifyBaseMilitarySkill(amount) {
        /**
         * Modify the military skill.
         * @param  {integer} amount - The amount to modify the skill by.
         */
        this.baseMilitarySkill += amount;
    }

    modifyBasePoliticalSkill(amount) {
        /**
         * Modify the political skill.
         * @param  {integer} amount - The amount to modify the skill by.
         */
        this.basePoliticalSkill += amount;
    }

    getMilitarySkill(printed = false, floor = true) {
        /**
         * Get the military skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The military skill value
         */
        if(printed) {
            return this.cardData.military;
        }

        if(this.cardData.military !== null && this.cardData.military !== undefined) {
            let skillFromAttachments = _.reduce(this.attachments._wrapped, (skill, card) => {
                if(parseInt(card.cardData.military_bonus)) {
                    return skill + parseInt(card.cardData.military_bonus);
                }
                return skill;
            }, 0);
            
            let modifiedMilitarySkill = this.baseMilitarySkill + this.militarySkillModifier + skillFromAttachments + this.getSkillFromGlory();
            let multipliedMilitarySkill = Math.round(modifiedMilitarySkill * this.militarySkillMultiplier);
            if(!floor) {
                return multipliedMilitarySkill;
            }
            return Math.max(0, multipliedMilitarySkill);
        }

        return null;
    }

    getPoliticalSkill(printed = false, floor = true) {
        /**
         * Get the political skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The political skill value
         */
        if(printed) {
            return this.cardData.political;
        }

        if(this.cardData.political !== null && this.cardData.political !== undefined) {
            let skillFromAttachments = _.reduce(this.attachments._wrapped, (skill, card) => {
                if(parseInt(card.cardData.political_bonus)) {
                    return skill + parseInt(card.cardData.political_bonus);
                }
                return skill;
            }, 0);
            let modifiedPoliticalSkill = this.basePoliticalSkill + this.politicalSkillModifier + skillFromAttachments + this.getSkillFromGlory();
            let multipliedPoliticalSkill = Math.round(modifiedPoliticalSkill * this.politicalSkillMultiplier);
            if(!floor) {
                return multipliedPoliticalSkill;
            }
            return Math.max(0, multipliedPoliticalSkill);
        }

        return null;
    }
    
    getSkillFromGlory() {
        if(!this.allowGameAction('affectedByHonor')) {
            return 0;
        }
        if(this.isHonored) {
            return this.getGlory();
        } else if(this.isDishonored) {
            return 0 - this.getGlory();
        }
        return 0;
    }

    modifyFate(amount) {
        /**
         * @param  {Number} amount - the amount of fate to modify this card's fate total by
         */
        this.fate = Math.max(0, this.fate + amount);
    }

    honor() {
        if(this.isDishonored) {
            this.isDishonored = false;
            return true;
        } else if(!this.isHonored) {
            this.isHonored = true;
            return true;
        }
        return false;
    }

    dishonor() {
        if(!this.allowGameAction('dishonor')) {
            return false;
        }
        if(this.isHonored) {
            this.isHonored = false;
            return true;
        } else if(!this.isDishonored) {
            this.isDishonored = true;
            return true;
        }
        return false;
    }

    bow() {
        if(this.allowGameAction('bow')) {
            this.bowed = true;
            return true;
        }
        return false;
    }

    ready() {
        if(this.allowGameAction('ready')) {
            this.bowed = false;
            return true;
        }
        return false;
    }

    needsCovertTarget() {
        return this.isCovert() && !this.covertTarget;
    }

    canUseCovertToBypass(targetCard) {
        return this.isCovert() && targetCard.canBeBypassedByCovert();
    }

    canBeBypassedByCovert() {
        return !this.isCovert() && this.type === 'character' && this.location === 'play area';
    }

    useCovertToBypass(targetCard) {
        if(!this.canUseCovertToBypass(targetCard)) {
            return false;
        }

        targetCard.covert = true;
        this.covertTarget = targetCard;

        return true;
    }

    clearBlank() {
        super.clearBlank();
    }

    /**
     * Checks 'no attachment' restrictions for this card when attempting to
     * attach the passed attachment card.
     */
    allowAttachment(attachment) {
        if(_.any(this.allowedAttachmentTraits, trait => attachment.hasTrait(trait))) {
            return true;
        }

        return (
            this.isBlank() ||
            this.allowedAttachmentTraits.length === 0
        );
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect,
            recalculateWhen: properties.recalculateWhen
        });
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card) {
        return card && card.getType() === 'character' && this.getType() === 'attachment';
    }

    canPlay(context) {
        return this.allowGameAction('play', context);
    }

    /**
     * Checks whether an attachment can be played on a given card.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(card) { // eslint-disable-line no-unused-vars
        return true;
    }

    canTriggerAbilities(location) {
        if(this.type === 'character' || this.type === 'attachment') {
            if(!location.includes(this.location) && this.location !== 'play area') {
                return false;
            }
        } else if(this.type === 'event') {
            if(!location.includes(this.location) && !this.controller.isCardInPlayableLocation(this, 'play')) {
                return false;
            }
        } else if(!this.location.includes('province')) {
            return false;
        }
        return super.canTriggerAbilities();
    }

    checkForIllegalAttachments() {
        let illegalAttachments = this.attachments.reject(attachment => this.allowAttachment(attachment) && attachment.canAttach(this));
        if(illegalAttachments.length > 0) {
            this.game.addMessage('{0} {1} discarded from {2} as it is no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', this);
            this.game.applyGameAction(null, { discardFromPlay: illegalAttachments });
        }
    }

    getActions() {
        return StandardPlayActions
            .concat(this.abilities.playActions)
            .concat(super.getActions());
    }

    /**
     * This removes an attachment from this card's attachment Array.  It doesn't open any windows for
     * game effects to respond to.
     * @param {DrawCard} attachment 
     */
    removeAttachment(attachment) {
        this.attachments = _(this.attachments.reject(card => card.uuid === attachment.uuid));
    }

    /**
     * Deals with the engine effects of leaving play, making sure all statuses are removed. Anything which changes
     * the state of the card should be here. This is also called in some strange corner cases e.g. for attachments
     * which aren't actually in play themselves when their parent (which is in play) leaves play.
     */
    leavesPlay() {
        // If this is an attachment and is attached to another card, we need to remove all links between them
        if(this.parent && this.parent.attachments) {
            this.parent.removeAttachment(this);
            this.parent = null;
        }

        if(this.isParticipating()) {
            this.game.currentConflict.removeFromConflict(this);
        }

        this.isDishonored = false;
        this.isHonored = false;
        this.bowed = false;
        this.covert = false;
        this.new = false;
        this.fate = 0;
        super.leavesPlay();
    }

    resetForConflict() {
        this.covert = false;
        //this.covertTarget = undefined;
        this.inConflict = false;
    }
    
    isAttacking() {
        return this.game.currentConflict && this.game.currentConflict.isAttacking(this);
    }

    isDefending() {
        return this.game.currentConflict && this.game.currentConflict.isDefending(this);
    }

    isParticipating() {
        return this.game.currentConflict && this.game.currentConflict.isParticipating(this);
    }

    canDeclareAsAttacker(conflictType = this.game.currentConflict.conflictType) {
        return (this.allowGameAction('declareAsAttacker') && this.canParticipateAsAttacker(conflictType) &&
                (!this.bowed || this.conflictOptions.canBeDeclaredWhileBowed));
    }

    canDeclareAsDefender(conflictType = this.game.currentConflict.conflictType) {
        return (this.allowGameAction('declareAsDefender') && this.canParticipateAsDefender(conflictType) && 
                (!this.bowed || this.conflictOptions.canBeDeclaredWhileBowed) && !this.covert);
    }

    canParticipateInConflict(conflictType = this.game.currentConflict.conflictType) {
        return this.location === 'play area' && !this.conflictOptions.cannotParticipateIn[conflictType];
    }

    canParticipateAsAttacker(conflictType = this.game.currentConflict.conflictType) {
        return this.allowGameAction('participateAsAttacker') && this.canParticipateInConflict(conflictType);
    }

    canParticipateAsDefender(conflictType = this.game.currentConflict.conflictType) {
        return this.allowGameAction('participateAsDefender') && this.canParticipateInConflict(conflictType);
    }

    play() {
    //empty function so playcardaction doesn't crash the game
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let baseSummary = super.getSummary(activePlayer, hideWhenFaceup);

        return _.extend(baseSummary, {
            attached: !!this.parent,
            attachments: this.attachments.map(attachment => {
                return attachment.getSummary(activePlayer, hideWhenFaceup);
            }),
            inConflict: this.inConflict,
            isConflict: this.isConflict,
            isDynasty: this.isDynasty,
            isDishonored: this.isDishonored,
            isHonored: this.isHonored,
            bowed: this.bowed,
            fate: this.fate,
            new: this.new,
            covert: this.covert
        });
    }
}

module.exports = DrawCard;
