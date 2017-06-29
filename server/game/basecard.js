const uuid = require('uuid');
const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const CardForcedInterrupt = require('./cardforcedinterrupt.js');
const CardForcedReaction = require('./cardforcedreaction.js');
const CardInterrupt = require('./cardinterrupt.js');
const CardReaction = require('./cardreaction.js');
const CustomPlayAction = require('./customplayaction.js');
const EventRegistrar = require('./eventregistrar.js');

const ValidKeywords = [
    'ancestral',
    'restricted',
    'limited',
    'sincerity',
    'pride'
];
const LocationsWithEventHandling = ['play area', 'province'];

class BaseCard {
    constructor(owner, cardData) {
        this.owner = owner;
        this.controller = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.code = cardData.code;
        this.name = cardData.name;
        this.facedown = false;
        this.blankCount = 0;

        this.tokens = {};
        this.strongholdModifierValues = {
            honor: 0,
            fate: 0,
            influence: 0,
            strength: 0
        };
        this.canProvideStrongholdModifier = {
            honor: true,
            fate: true,
            influence: true,
            strength: true
        };
        this.provinceModifierValues = {
            strength: 0
        };
        this.canProvideProvinceModifier = {
            strength: true
        };
        this.abilityRestrictions = [];
        this.menu = _([]);
        this.events = new EventRegistrar(this.game, this);

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
        this.parseKeywords(cardData.text || '');
        this.parseTraits(cardData.keywords || '');
        this.setupCardAbilities(AbilityDsl);

        this.factions = {};
        this.addFaction(cardData.clan);
    }

    parseKeywords(text) {
        var firstLine = text.split('\n')[0];
        var potentialKeywords = _.map(firstLine.split('.'), k => k.toLowerCase().trim());

        this.keywords = {};
        this.printedKeywords = [];
        this.allowedAttachmentTrait = 'any';

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.printedKeywords.push(keyword);
            } else if(keyword.indexOf('no attachment') === 0) {
                var match = keyword.match(/no attachments except <[bi]>(.*)<\/[bi]>/);
                if(match) {
                    this.allowedAttachmentTrait = match[1];
                } else {
                    this.allowedAttachmentTrait = 'none';
                }
            }
        });

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
                effect: AbilityDsl.effects.addMultipleKeywords(this.printedKeywords)
            });
        }
    }

    parseTraits(traits) {
        this.traits = {};

        var firstLine = traits.split('\n')[0];

        _.each(firstLine.split('.'), trait => this.addTrait(trait.toLowerCase().trim()));
    }

    registerEvents(events) {
        this.eventsForRegistration = events;
    }

    setupCardAbilities() {
    }

    provinceModifiers(modifiers) {
        this.provincetModifierValues = _.extend(this.provinceModifierValues, modifiers);
        if(modifiers.strength) {
            this.persistentEffect({
                condition: () => this.canProvideProvinceModifier['strength'],
                match: card => card.controller.activeProvince === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyStrength(modifiers.strength)
            });
        }
    }

    action(properties) {
        var action = new CardAction(this.game, this, properties);

        if(!action.isClickToActivate() && action.allowMenu()) {
            var index = this.abilities.actions.length;
            this.menu.push(action.getMenuItem(index));
        }
        this.abilities.actions.push(action);
    }

    reaction(properties) {
        var reaction = new CardReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedReaction(properties) {
        var reaction = new CardForcedReaction(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    interrupt(properties) {
        var reaction = new CardInterrupt(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    forcedInterrupt(properties) {
        var reaction = new CardForcedInterrupt(this.game, this, properties);
        this.abilities.reactions.push(reaction);
    }

    /**
     * Defines a special play action that can occur when the card is outside the
     * play area (e.g. Lady-in-Waiting's dupe marshal ability)
     */
    playAction(properties) {
        this.abilities.playActions.push(new CustomPlayAction(properties));
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        this.abilities.persistentEffects.push(_.extend({ duration: 'persistent' }, properties));
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
            condition: properties.condition,
            match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect,
            recalculateWhen: properties.recalculateWhen
        });
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * challenge.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfConflict' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfPhase' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfPhase' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfRound' }, properties));
    }

    doAction(player, arg) {
        var action = this.abilities.actions[arg];

        if(!action) {
            return;
        }

        action.execute(player, arg);
    }

    hasKeyword(keyword) {
        var keywordCount = this.keywords[keyword.toLowerCase()] || 0;
        return keywordCount > 0;
    }

    hasPrintedKeyword(keyword) {
        return this.printedKeywords.includes(keyword.toLowerCase());
    }

    hasTrait(trait) {
        return !!this.traits[trait.toLowerCase()];
    }

    isFaction(faction) {
        return !!this.factions[faction.toLowerCase()];
    }

    play() {
        _.each(this.abilities.persistentEffects, effect => {
            this.game.addEffect(this, effect);
        });
    }

    leavesPlay() {
        this.tokens = {};
    }

    moveTo(targetLocation) {
        if(LocationsWithEventHandling.includes(targetLocation) && !LocationsWithEventHandling.includes(this.location)) {
            this.events.register(this.eventsForRegistration);
        } else if(LocationsWithEventHandling.includes(this.location) && !LocationsWithEventHandling.includes(targetLocation)) {
            this.events.unregisterAll();
        }

        _.each(this.abilities.actions, action => {
            if(action.isEventListeningLocation(targetLocation) && !action.isEventListeningLocation(this.location)) {
                action.registerEvents();
            } else if(action.isEventListeningLocation(this.location) && !action.isEventListeningLocation(targetLocation)) {
                action.unregisterEvents();
            }
        });
        _.each(this.abilities.reactions, reaction => {
            if(reaction.isEventListeningLocation(targetLocation) && !reaction.isEventListeningLocation(this.location)) {
                reaction.registerEvents();
            } else if(reaction.isEventListeningLocation(this.location) && !reaction.isEventListeningLocation(targetLocation)) {
                reaction.unregisterEvents();
            }
        });

        if(targetLocation !== 'play area') {
            this.facedown = false;
        }

        this.location = targetLocation;
    }

    modifyFavor(player, glory) {
        return glory;
    }

    canPlay() {
        return true;
    }

    getMenu() {
        var menu = [];

        if(this.menu.isEmpty()) {
            return undefined;
        }

        menu.push({ command: 'click', text: 'Select Card' });
        menu = menu.concat(this.menu.value());

        return menu;
    }

    isUnique() {
        return this.cardData.is_unique;
    }

    isBlank() {
        return this.blankCount > 0;
    }

    getType() {
        return this.cardData.type;
    }

    getPrintedFaction() {
        return this.cardData.clan;
    }

    setBlank() {
        var before = this.isBlank();
        this.blankCount++;
        var after = this.isBlank();
        if(!before && after) {
            this.game.raiseEvent('onCardBlankToggled', this, after);
        }
    }

    allowGameAction(actionType) {
        let currentAbilityContext = this.game.currentAbilityContext;
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch(actionType, currentAbilityContext));
    }

    allowEffectFrom(sourceCard) {
        let currentAbilityContext = { source: 'card', card: sourceCard, stage: 'effect' };
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch('applyEffect', currentAbilityContext));
    }

    addAbilityRestriction(restriction) {
        this.abilityRestrictions.push(restriction);
    }

    removeAbilityRestriction(restriction) {
        this.abilityRestrictions = _.reject(this.abilityRestrictions, r => r === restriction);
    }

    addKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();
        this.keywords[lowerCaseKeyword] = this.keywords[lowerCaseKeyword] || 0;
        this.keywords[lowerCaseKeyword]++;
    }

    addTrait(trait) {
        var lowerCaseTrait = trait.toLowerCase();

        if(!lowerCaseTrait || lowerCaseTrait === '') {
            return;
        }

        if(!this.traits[lowerCaseTrait]) {
            this.traits[lowerCaseTrait] = 1;
        } else {
            this.traits[lowerCaseTrait]++;
        }
    }

    addFaction(faction) {
        if(!faction) {
            return;
        }

        var lowerCaseFaction = faction.toLowerCase();
        this.factions[lowerCaseFaction] = this.factions[lowerCaseFaction] || 0;
        this.factions[lowerCaseFaction]++;
    }

    removeKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();
        this.keywords[lowerCaseKeyword] = this.keywords[lowerCaseKeyword] || 0;
        this.keywords[lowerCaseKeyword]--;
    }

    removeTrait(trait) {
        this.traits[trait.toLowerCase()]--;
    }

    removeFaction(faction) {
        this.factions[faction.toLowerCase()]--;
    }

    clearBlank() {
        var before = this.isBlank();
        this.blankCount--;
        var after = this.isBlank();
        if(before && !after) {
            this.game.raiseEvent('onCardBlankToggled', this, after);
        }
    }

    addToken(type, number) {
        if(_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    removeToken(type, number) {
        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if(this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    onClick(player) {
        var action = _.find(this.abilities.actions, action => action.isClickToActivate());
        if(action) {
            return action.execute(player) || action.deactivate(player);
        }

        return false;
    }

    getShortSummary() {
        return {
            code: this.cardData.code,
            label: this.cardData.name,
            name: this.cardData.name,
            type: this.getType()
        };
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.owner;

        if(!isActivePlayer && (this.facedown || hideWhenFaceup)) {
            return { facedown: true };
        }

        let selectionState = activePlayer.getCardSelectionState(this);
        let state = {
            code: this.cardData.code,
            controlled: this.owner !== this.controller,
            facedown: this.facedown,
            menu: this.getMenu(),
            name: this.cardData.name,
            new: this.new,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return _.extend(state, selectionState);
    }
}

module.exports = BaseCard;
