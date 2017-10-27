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
    'courtesy',
    'pride',
    'covert'
];
const LocationsWithEventHandling = ['play area', 'province'];

class BaseCard {
    constructor(owner, cardData) {
        this.owner = owner;
        this.controller = owner;
        this.game = this.owner.game;
        this.cardData = cardData;

        this.uuid = uuid.v1();
        this.id = cardData.id;
        this.name = cardData.name;
        this.facedown = false;
        this.blankCount = 0;
        this.inConflict = false;

        this.type = cardData.type;

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
        this.parseKeywords(cardData.text_canonical || '');
        this.parseTraits(cardData.traits || '');
        this.setupCardAbilities(AbilityDsl);

        this.factions = {};
        this.addFaction(cardData.clan);

        this.isProvince = false;
        this.isConflict = false;
        this.isDynasty = false;
        this.isStronghold = false;
    }

    parseKeywords(text) {
        var lines = text.split('\n');
        var potentialKeywords = [];
        _.each(lines, line => {
            line = line.slice(0, -1);
            _.each(line.split('. '), k => potentialKeywords.push(k));
        });

        this.keywords = {};
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

        if(this.printedKeywords.length > 0) {
            this.persistentEffect({
                match: this,
                effect: AbilityDsl.effects.addMultipleKeywords(this.printedKeywords)
            });
        }
    }

    parseTraits(traits) {
        this.traits = {};

        _.each(traits, trait => this.addTrait(trait));
    }

    registerEvents(events) {
        this.eventsForRegistration = events;
    }

    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
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
        /*
        if(!action.isClickToActivate() && action.allowMenu()) {
            var index = this.abilities.actions.length;
            this.menu.push(action.getMenuItem(index));
        }*/
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
        const allowedLocations = ['any', 'play area'];
        const defaultLocationForType = {
            province: 'any'
        };

        let location = properties.location || defaultLocationForType[this.getType()] || 'play area';
        if(!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        this.abilities.persistentEffects.push(_.extend({ duration: 'persistent', location: location }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the current
     * conflict.
     */
    untilEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the current 
     * conflict. Per game rules this duration is outside of the phase.
     */
    atEndOfConflict(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfConflict', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which expires at the end of the phase. Per
     * game rules this duration is outside of the phase.
     */
    atEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'atEndOfPhase', location: 'any' }, properties));
    }

    /**
     * Applies an immediate effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfRound', location: 'any' }, properties));
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'custom', location: 'any' }, properties));
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
        let traitCount = this.traits[trait.toLowerCase()] || 0;
        return traitCount > 0;
    }

    getTraits() {
        return _.keys(_.omit(this.traits, trait => trait < 1));
    }

    isFaction(faction) {
        return !!this.factions[faction.toLowerCase()];
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location === 'any') {
                this.game.addEffect(this, effect);
            }
        });
    }

    applyPersistentEffects() {
        _.each(this.abilities.persistentEffects, effect => {
            if(effect.location !== 'any') {
                this.game.addEffect(this, effect);
            }
        });
    }

    leavesPlay() {
        this.tokens = {};
        _.each(this.abilities.actions, action => action.limit.reset());
        _.each(this.abilities.reactions, reaction => reaction.limit.reset());
        this.controller = this.owner;
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if(LocationsWithEventHandling.includes(targetLocation) && !LocationsWithEventHandling.includes(originalLocation)) {
            this.events.register(this.eventsForRegistration);
        } else if(LocationsWithEventHandling.includes(originalLocation) && !LocationsWithEventHandling.includes(targetLocation)) {
            this.events.unregisterAll();
        }

        _.each(this.abilities.actions, action => {
            if(action.isEventListeningLocation(targetLocation) && !action.isEventListeningLocation(originalLocation)) {
                action.registerEvents();
            } else if(action.isEventListeningLocation(originalLocation) && !action.isEventListeningLocation(targetLocation)) {
                action.unregisterEvents();
            }
        });
        _.each(this.abilities.reactions, reaction => {
            if(reaction.isEventListeningLocation(targetLocation) && !reaction.isEventListeningLocation(originalLocation)) {
                reaction.registerEvents();
                this.game.registerAbility(reaction);
            } else if(reaction.isEventListeningLocation(originalLocation) && !reaction.isEventListeningLocation(targetLocation)) {
                reaction.unregisterEvents();
            }
        });

        if(targetLocation !== 'play area') {
            this.facedown = false;
        }

        if(originalLocation !== targetLocation) {
            this.game.raiseEvent('onCardMoved', { card: this, originalLocation: originalLocation, newLocation: targetLocation });
        }
    }

    modifyFavor(player, glory) {
        return glory;
    }

    canPlay() {
        return true;
    }
    
    canTriggerAbilities() {
        return this.allowGameAction('triggerAbilities');
    }
    
    getMenu() {
        var menu = [];

        if(this.menu.isEmpty() || !this.game.manualMode || 
                !['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'].includes(this.location)) {
            return undefined;
        }
        
        if(this.facedown) {
            return [{ command: 'reveal', text: 'Reveal' }];
        }

        menu.push({ command: 'click', text: 'Select Card' });
        if(this.location === 'play area' || this.isProvince || this.isStronghold) {
            menu = menu.concat(this.menu.value());
        }
        
        return menu;
    }

    isUnique() {
        return this.cardData.unicity;
    }

    isBlank() {
        return this.blankCount > 0;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return this.cardData.clan;
    }

    setBlank() {
        var before = this.isBlank();
        this.blankCount++;
        var after = this.isBlank();
        if(!before && after) {
            this.game.raiseEvent('onCardBlankToggled', { card: this, isBlank: after });
        }
    }

    allowGameAction(actionType, abilityContext = this.game.getCurrentAbilityContext()) {
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch(actionType, this, abilityContext));
    }

    allowEffectFrom(sourceCard) {
        let currentAbilityContext = { source: 'card', card: sourceCard, stage: 'effect' };
        return !_.any(this.abilityRestrictions, restriction => restriction.isMatch('applyEffect', this, currentAbilityContext));
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
        let lowerCaseTrait = trait.toLowerCase();

        if(!lowerCaseTrait || lowerCaseTrait === '') {
            return;
        }

        if(!this.traits[lowerCaseTrait]) {
            this.traits[lowerCaseTrait] = 1;
        } else {
            this.traits[lowerCaseTrait]++;
        }

        this.game.raiseEvent('onCardTraitChanged', { card: this });
    }

    addFaction(faction) {
        if(!faction) {
            return;
        }

        var lowerCaseFaction = faction.toLowerCase();
        this.factions[lowerCaseFaction] = this.factions[lowerCaseFaction] || 0;
        this.factions[lowerCaseFaction]++;

        this.game.raiseEvent('onCardFactionChanged', { card: this });
    }

    removeKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();
        this.keywords[lowerCaseKeyword] = this.keywords[lowerCaseKeyword] || 0;
        this.keywords[lowerCaseKeyword]--;
    }

    removeTrait(trait) {
        let lowerCaseTrait = trait.toLowerCase();
        this.traits[lowerCaseTrait] = this.traits[lowerCaseTrait] || 0;
        this.traits[lowerCaseTrait]--;
        this.game.raiseEvent('onCardTraitChanged', { card: this });
    }

    removeFaction(faction) {
        this.factions[faction.toLowerCase()]--;
        this.game.raiseEvent('onCardFactionChanged', { card: this });
    }

    clearBlank() {
        var before = this.isBlank();
        this.blankCount--;
        var after = this.isBlank();
        if(before && !after) {
            this.game.raiseEvent('onCardBlankToggled', { card: this, isBlank: after });
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
    
    getActions() {
        return this.abilities.actions;
    }

    getProvinceStrengthBonus() {
        return 0;
    }

    getShortSummary() {
        return {
            id: this.cardData.id,
            label: this.cardData.name,
            name: this.cardData.name,
            type: this.getType()
        };
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isActivePlayer = activePlayer === this.owner;

        if(!isActivePlayer && (this.facedown || hideWhenFaceup) && this.isProvince) {
            return { 
                uuid: this.uuid,
                inConflict: this.inConflict,
                facedown: true};
        }

        if(!isActivePlayer && (this.facedown || hideWhenFaceup)) {
            return { 
                facedown: true};
        }

        let selectionState = activePlayer.getCardSelectionState(this);
        let state = {
            id: this.cardData.id,
            controlled: this.owner !== this.controller,
            inConflict: this.inConflict,
            facedown: this.facedown,
            menu: this.getMenu(),
            name: this.cardData.name,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        };

        return _.extend(state, selectionState);
    }
}

module.exports = BaseCard;
