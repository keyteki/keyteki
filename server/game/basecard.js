const uuid = require('node-uuid');
const _ = require('underscore');

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
        this.inPlay = false;
        this.blankCount = 0;

        this.tokens = {};

        this.menu = _([]);
        this.parseCard(cardData.text || '');
    }

    parseCard(text) {
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

    registerEvents(events) {
        this.events = [];

        _.each(events, event => {
            this[event] = this[event].bind(this);

            this.game.on(event, this[event]);

            this.events.push(event);
        });
    }

    hasKeyword(keyword) {
        if(this.isBlank()) {
            return false;
        }

        var keywordEntry = this.keywords[keyword.toLowerCase()];

        return !!keywordEntry;
    }

    hasTrait(trait) {
        return this.cardData.traits && this.cardData.traits.toLowerCase().indexOf(trait.toLowerCase() + '.') !== -1;
    }

    play() {
        this.inPlay = true;
    }

    leavesPlay() {
        _.each(this.events, event => {
            this.game.removeListener(event, this[event]);
        });

        this.inPlay = false;
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

    removeKeyword(keyword) {
        this.keywords[keyword.toLowerCase()]--;
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

    removeToken(type, number) {
        this.tokens[type] -= number;

        if(this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }
    }

    getSummary(isActivePlayer, hideWhenFaceup) {
        return isActivePlayer || (!this.facedown && !hideWhenFaceup) ? {
            code: this.cardData.code,
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
