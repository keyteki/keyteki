const uuid = require('node-uuid');
const _ = require('underscore');

const CardAction = require('./cardaction.js');
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

        this.menu = _([]);
        this.parseKeywords(cardData.text || '');
        this.parseTraits(cardData.traits || '');

        this.events = new EventRegistrar(this.game, this);

        this.abilities = {};
        this.setupCardAbilities();
    }

    parseKeywords(text) {
        var firstLine = text.split('\n')[0];
        var potentialKeywords = _.map(firstLine.split('.'), k => k.toLowerCase().trim());

        this.keywords = {};
        this.allowedAttachmentTrait = 'any';

        _.each(potentialKeywords, keyword => {
            if(_.contains(ValidKeywords, keyword)) {
                this.addKeyword(keyword);
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
            }
        });
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

    action(properties) {
        var action = new CardAction(this.game, this, properties);
        this.abilities.action = action;
        this.menu.push(action.getMenuItem());
    }

    doAction(player, arg) {
        if(!this.abilities.action) {
            return;
        }

        this.abilities.action.execute(player, arg);
    }

    hasKeyword(keyword) {
        if(this.isBlank()) {
            return false;
        }

        var keywordEntry = this.keywords[keyword.toLowerCase()];

        return !!keywordEntry;
    }

    hasTrait(trait) {
        return !!this.traits[trait.toLowerCase()];
    }

    play() {
    }

    leavesPlay() {
        this.tokens = {};
    }

    moveTo(targetLocation) {
        if(LocationsWithEventHandling.includes(targetLocation) && !LocationsWithEventHandling.includes(this.location)) {
            this.events.register(this.eventsForRegistration);
            if(this.abilities.action) {
                this.abilities.action.registerEvents();
            }
        } else if(LocationsWithEventHandling.includes(this.location) && !LocationsWithEventHandling.includes(targetLocation)) {
            this.events.unregisterAll();
            if(this.abilities.action) {
                this.abilities.action.unregisterEvents();
            }
        }

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

    canReduce() {
        return false;
    }

    getInitiative() {
        return 0;
    }

    getIncome() {
        return 0;
    }

    getReserve() {
        return 0;
    }

    getFaction() {
        return this.cardData.faction_code;
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

    reduce(card, cost) {
        return cost;
    }

    modifyClaim(player, type, claim) {
        return claim;
    }

    setBlank() {
        this.blankCount++;
    }

    addKeyword(keyword) {
        var lowerCaseKeyword = keyword.toLowerCase();

        if(!this.keywords[lowerCaseKeyword]) {
            this.keywords[lowerCaseKeyword] = 1;
        } else {
            this.keywords[lowerCaseKeyword]++;
        }
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

    removeKeyword(keyword) {
        this.keywords[keyword.toLowerCase()]--;
    }

    removeTrait(trait) {
        this.traits[trait.toLowerCase()]--;
    }

    clearBlank() {
        this.blankCount--;
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
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        return isActivePlayer || (!this.facedown && !hideWhenFaceup) ? {
            code: this.cardData.code,
            controlled: this.owner !== this.controller,
            facedown: this.facedown,
            menu: this.getMenu(),
            name: this.cardData.label,
            new: this.new,
            selected: isActivePlayer && this.selected,
            tokens: this.tokens,
            type: this.getType(),
            uuid: this.uuid
        } : { facedown: true };
    }
}

module.exports = BaseCard;
