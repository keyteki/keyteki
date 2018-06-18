const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const BaseCard = require('./basecard.js');
const DynastyCardAction = require('./dynastycardaction.js');
const PlayAttachmentAction = require('./playattachmentaction.js');
const PlayCharacterAction = require('./playcharacteraction.js');
const DuplicateUniqueAction = require('./duplicateuniqueaction.js');
const CourtesyAbility = require('./KeywordAbilities/CourtesyAbility');
const PersonalHonorAbility = require('./KeywordAbilities/PersonalHonorAbility');
const PrideAbility = require('./KeywordAbilities/PrideAbility');
const SincerityAbility = require('./KeywordAbilities/SincerityAbility');

const ValidKeywords = [
    'ancestral',
    'restricted',
    'limited',
    'sincerity',
    'courtesy',
    'pride',
    'covert'
];

class DrawCard extends BaseCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.defaultController = owner;
        this.attachments = _([]);
        this.parent = null;

        this.printedMilitarySkill = cardData.military;
        this.printedPoliticalSkill = cardData.political;
        this.fate = 0;
        this.bowed = false;
        this.covert = false;
        this.isConflict = cardData.side === 'conflict';
        this.isDynasty = cardData.side === 'dynasty';
        this.isHonored = false;
        this.isDishonored = false;

        this.parseKeywords(cardData.text ? cardData.text.replace(/<[^>]*>/g, '').toLowerCase() : '');

        this.menu = _([
            { command: 'bow', text: 'Bow/Ready' },
            { command: 'honor', text: 'Honor' },
            { command: 'dishonor', text: 'Dishonor' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'move', text: 'Move into/out of conflict' },
            { command: 'control', text: 'Give control' }
        ]);

        if(cardData.type === 'character') {
            this.abilities.reactions.push(new CourtesyAbility(this.game, this));
            this.abilities.reactions.push(new PersonalHonorAbility(this.game, this));
            this.abilities.reactions.push(new PrideAbility(this.game, this));
            this.abilities.reactions.push(new SincerityAbility(this.game, this));
        }
    }

    parseKeywords(text) {
        var lines = text.split('\n');
        var potentialKeywords = [];
        _.each(lines, line => {
            line = line.slice(0, -1);
            _.each(line.split('. '), k => potentialKeywords.push(k));
        });

        this.printedKeywords = [];
        this.allowedAttachmentTraits = [];

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.printedKeywords.push(keyword);
            } else if(keyword.startsWith('no attachments except')) {
                var traits = keyword.replace('no attachments except ', '');
                this.allowedAttachmentTraits = traits.split(' or ');
            } else if(keyword.startsWith('no attachments')) {
                this.allowedAttachmentTraits = ['none'];
            }
        });

        this.printedKeywords.forEach(keyword => {
            this.persistentEffect({
                match: this,
                effect: AbilityDsl.effects.addKeyword(keyword)
            });
        });
    }


    hasKeyword(keyword) {
        return this.getEffects('addKeyword').includes(keyword.toLowerCase());
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
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

    anotherUniqueInPlay(player) {
        return this.isUnique() && this.game.allCards.any(card => (
            card.location === 'play area' &&
            card.name === this.name &&
            ((card.owner === player || card.controller === player) || (card.owner === this.owner)) &&
            card !== this
        ));
    }

    createSnapshot() {
        let clone = new DrawCard(this.owner, this.cardData);

        clone.attachments = _(this.attachments.map(attachment => attachment.createSnapshot()));
        clone.effects = _.clone(this.effects);
        clone.controller = this.controller;
        clone.bowed = this.bowed;
        clone.isHonored = this.isHonored;
        clone.isDishonored = this.isDishonored;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.fate = this.fate;
        clone.inConflict = this.inConflict;
        return clone;
    }

    hasDash(type = '') {
        let dashEffects = this.getEffects('setDash');
        if(type === 'military') {
            return this.printedMilitarySkill === null || dashEffects.includes(type);
        } else if(type === 'political') {
            return this.printedPoliticalSkill === null || dashEffects.includes(type);
        }
        return this.printedMilitarySkill === null || this.printedPoliticalSkill === null || dashEffects.length > 0;
    }

    getSkill(type) {
        /**
         * Direct the skill query to the correct sub function.
         * @param  {string} type - The type of the skill; military or political
         * @return {integer} The chosen skill value
         */
        if(type === 'military') {
            return this.getMilitarySkill();
        } else if(type === 'political') {
            return this.getPoliticalSkill();
        }
    }

    get glory() {
        return this.getGlory();
    }

    getGlory() {
        /**
         * Get this card's glory.
         * @return {integer} The military skill value
         */
        if(this.cardData.glory !== null && this.cardData.glory !== undefined) {
            return Math.max(0, this.sumEffects('modifyGlory') + this.cardData.glory);
        }
        return 0;
    }

    getProvinceStrengthBonus() {
        if(this.cardData.strength_bonus && !this.facedown) {
            return parseInt(this.cardData.strength_bonus);
        }
        return 0;
    }

    get militarySkill() {
        return this.getMilitarySkill();
    }

    getMilitarySkill(floor = true) {
        /**
         * Get the military skill.
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The military skill value
         */

        if(this.hasDash('military')) {
            return 0;
        } else if(this.mostRecentEffect('setMilitarySkill')) {
            return this.mostRecentEffect('setMilitarySkill');
        }

        // get base mill skill + effect modifiers
        let skill = this.sumEffects('modifyMilitarySkill') + this.sumEffects('modifyBothSkills') + this.getBaseMilitarySkill();
        // add attachment bonuses and skill from glory
        skill = this.getSkillFromGlory() + this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.military_bonus);
            return bonus ? total + bonus : total;
        }, skill);
        // multiply total
        skill = this.getEffects('modifyMilitarySkillMultiplier').reduce((total, effect) => total * effect.value, skill);
        return floor ? Math.max(0, skill) : skill;
    }

    get politicalSkill() {
        return this.getPoliticalSkill();
    }

    getPoliticalSkill(floor = true) {
        /**
         * Get the political skill.
         * @param  {boolean} printed - Use the printed value of the skill; default false
         * @param  {boolean} floor - Return the value after flooring it at 0; default false
         * @return {integer} The political skill value
         */
        if(this.hasDash('political')) {
            return 0;
        } else if(this.mostRecentEffect('setPoliticalSkill')) {
            return this.mostRecentEffect('setPoliticalSkill');
        }

        // get base mill skill + effect modifiers
        let skill = this.sumEffects('modifyPoliticalSkill') + this.sumEffects('modifyBothSkills') + this.getBasePoliticalSkill();
        // add attachment bonuses and skill from glory
        skill = this.getSkillFromGlory() + this.attachments.reduce((total, card) => {
            let bonus = parseInt(card.cardData.political_bonus);
            return bonus ? total + bonus : total;
        }, skill);
        // multiply total
        skill = this.getEffects('modifyPoliticalSkillMultiplier').reduce((total, effect) => total * effect.value, skill);
        return floor ? Math.max(0, skill) : skill;
    }

    getBaseMilitarySkill() {
        if(this.hasDash('military')) {
            return 0;
        }

        return this.mostRecentEffect('setBaseMilitarySkill') ||
               this.sumEffects('modifyBaseMilitarySkill') + this.printedMilitarySkill;
    }

    getBasePoliticalSkill() {
        if(this.hasDash('political')) {
            return 0;
        }

        return this.mostRecentEffect('setBasePoliticalSkill') ||
               this.sumEffects('modifyBasePoliticalSkill') + this.printedPoliticalSkill;
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

    getContributionToImperialFavor() {
        return !this.bowed ? this.glory : 0;
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
        } else {
            this.isHonored = true;
        }
    }

    dishonor() {
        if(this.isHonored) {
            this.isHonored = false;
        } else {
            this.isDishonored = true;
        }
    }

    bow() {
        this.bowed = true;
    }

    ready() {
        this.bowed = false;
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
            effect: properties.effect
        });
    }

    /**
     * Checks whether the passed card meets the attachment restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    canAttach(card, context) { // eslint-disable-line no-unused-vars
        return card && card.getType() === 'character' && this.getType() === 'attachment';
    }

    canPlay(context) {
        return this.checkRestrictions('play', context);
    }

    /**
     * Checks whether an attachment can be played on a given card.  Intended to be
     * used by cards inheriting this class
     */
    canPlayOn(card) { // eslint-disable-line no-unused-vars
        return true;
    }

    checkForIllegalAttachments() {
        // TODO: Context object here?
        let illegalAttachments = this.attachments.filter(attachment => (
            !this.allowAttachment(attachment) || !attachment.canAttach(this, { game: this.game, player: this.controller })
        ));
        if(illegalAttachments.length > 0) {
            this.game.addMessage('{0} {1} discarded from {2} as it is no longer legally attached', illegalAttachments, illegalAttachments.length > 1 ? 'are' : 'is', this);
            this.game.applyGameAction(null, { discardFromPlay: illegalAttachments });
            return true;
        } else if(this.attachments.filter(card => card.isRestricted()).length > 2) {
            this.game.promptForSelect(this.controller, {
                activePromptTitle: 'Choose an attachment to discard',
                waitingPromptTitle: 'Waiting for opponent to choose an attachment to discard',
                controller: 'self',
                cardCondition: card => card.parent === this && card.isRestricted(),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} discards {1} from {2} due to too many Restricted attachments', player, card, card.parent);
                    this.game.applyGameAction(null, { discardFromPlay: card });
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
            return true;
        }
        return false;
    }

    getActions(player) {
        if(this.location === 'play area') {
            return super.getActions();
        }
        let actions = [];
        if(this.type === 'character') {
            if(player.getDuplicateInPlay(this)) {
                actions.push(new DuplicateUniqueAction(this));
            } else if(this.isDynasty && this.location !== 'hand') {
                actions.push(new DynastyCardAction(this));
            } else {
                actions.push(new PlayCharacterAction(this));
            }
        } else if(this.type === 'attachment') {
            actions.push(new PlayAttachmentAction(this));
        }
        return actions.concat(this.abilities.playActions, super.getActions());
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
        this.inConflict = false;
    }

    canDeclareAsAttacker(conflictType = this.game.currentConflict.conflictType) {
        return (this.allowGameAction('declareAsAttacker') && this.canParticipateAsAttacker(conflictType) &&
                this.location === 'play area' && !this.bowed);
    }

    canDeclareAsDefender(conflictType = this.game.currentConflict.conflictType) {
        return (this.allowGameAction('declareAsDefender') && this.canParticipateAsDefender(conflictType) &&
                this.location === 'play area' && !this.bowed && !this.covert);
    }

    canParticipateAsAttacker(conflictType = this.game.currentConflict.conflictType) {
        let effects = this.getEffects('cannotParticipateAsAttacker');
        return !effects.some(value => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    canParticipateAsDefender(conflictType = this.game.currentConflict.conflictType) {
        let effects = this.getEffects('cannotParticipateAsDefender');
        return !effects.some(value => value === 'both' || value === conflictType) && !this.hasDash(conflictType);
    }

    bowsOnReturnHome() {
        return !this.anyEffect('doesNotBow');
    }

    readiesDuringReadyPhase() {
        return this.anyEffect('doesNotReady');
    }

    setDefaultController(player) {
        this.defaultController = player;
    }

    getModifiedController() {
        if(this.location === 'play area') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }
        return this.owner;
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
