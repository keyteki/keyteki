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
    'ambush',
    'insight',
    'intimidate',
    'pillage',
    'renown',
    'stealth',
    'terminal',
    'limited'
];
const LocationsWithEventHandling = ['play area', 'active plot', 'faction', 'agenda'];

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
        this.plotModifierValues = {
            gold: 0,
            initiative: 0,
            reserve: 0
        };
        this.canProvidePlotModifier = {
            gold: true,
            initiative: true,
            reserve: true
        };
        this.menu = _([]);
        this.events = new EventRegistrar(this.game, this);

        this.abilities = { actions: [], reactions: [], persistentEffects: [], playActions: [] };
        this.parseKeywords(cardData.text || '');
        this.parseTraits(cardData.traits || '');
        this.setupCardAbilities(AbilityDsl);

        this.factions = {};
        this.addFaction(cardData.faction_code);
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
            } else if(keyword.indexOf('ambush') === 0) {
                match = keyword.match(/ambush \((.*)\)/);
                if(match) {
                    this.ambushCost = parseInt(match[1]);
                }
            } else if(keyword.indexOf('bestow') === 0) {
                match = keyword.match(/bestow \((.*)\)/);
                if(match) {
                    this.bestowMax = parseInt(match[1]);
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

    plotModifiers(modifiers) {
        this.plotModifierValues = _.extend(this.plotModifierValues, modifiers);
        if(modifiers.gold) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['gold'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyGold(modifiers.gold)
            });
        }
        if(modifiers.initiative) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['initiative'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyInitiative(modifiers.initiative)
            });
        }
        if(modifiers.reserve) {
            this.persistentEffect({
                condition: () => this.canProvidePlotModifier['reserve'],
                match: card => card.controller.activePlot === card,
                targetController: 'current',
                effect: AbilityDsl.effects.modifyReserve(modifiers.reserve)
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
    untilEndOfChallenge(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        this.game.addEffect(this, _.extend({ duration: 'untilEndOfChallenge' }, properties));
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

    isLoyal() {
        return this.cardData.is_loyal;
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

    modifyDominance(player, strength) {
        return strength;
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
        return this.cardData.type_code;
    }

    getPrintedFaction() {
        return this.cardData.faction_code;
    }

    modifyClaim(player, type, claim) {
        return claim;
    }

    setBlank() {
        var before = this.isBlank();
        this.blankCount++;
        var after = this.isBlank();
        if(!before && after) {
            this.game.raiseEvent('onCardBlankToggled', this, after);
        }
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

    getSummary(isActivePlayer, hideWhenFaceup) {
        return isActivePlayer || (!this.facedown && !hideWhenFaceup) ? {
            code: this.cardData.code,
            controlled: this.owner !== this.controller,
            facedown: this.facedown,
            menu: this.getMenu(),
            name: this.cardData.label,
            new: this.new,
            selected: (isActivePlayer && this.selected) || this.opponentSelected,
            selectable: (isActivePlayer && this.selectable),
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        } : { facedown: true };
    }
}

module.exports = BaseCard;
