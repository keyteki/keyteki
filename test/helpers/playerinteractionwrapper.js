/*eslint no-console:0 */
const _ = require('underscore');

const { matchCardByNameAndPack } = require('./cardutil.js');
const { detectBinary } = require('../../server/util');

class PlayerInteractionWrapper {
    constructor(game, player) {
        this.game = game;
        this.player = player;

        player.noTimer = true;
    }

    get name() {
        return this.player.name;
    }

    get amber() {
        return this.player.amber;
    }

    set amber(newValue) {
        if (newValue >= 0) {
            this.player.amber = newValue;
        }
    }

    get chains() {
        return this.player.chains;
    }

    set chains(newValue) {
        if (newValue > 0) {
            this.player.chains = newValue;
        }
    }

    get hand() {
        return this.player.hand;
    }

    /**
     * Sets the player's hand to contain the specified cards. Moves cards between
     * hand and conflict deck
     * @param {String|DrawCard)[]} [cards] - a list of card names, ids or objects
     */
    set hand(cards = []) {
        //Move all cards in hand to the deck
        var cardsInHand = this.hand;
        _.each(cardsInHand, (card) => this.moveCard(card, 'deck'));
        cards = this.mixedListToCardList(cards, 'deck');
        _.each(cards, (card) => this.moveCard(card, 'hand'));
    }

    /**
     * Gets all cards in play for a player
     * @return {DrawCard[]} - List of player's cards currently in play
     */
    get inPlay() {
        return this.player.cardsInPlay;
    }

    /**
     * List of objects describing characters in play and any upgrades:
     * Either as Object:
     * {
     *    card: String,
     *    fate: Integer,
     *    honor: 'honored' or 'dishonored',
     *    bowed: Boolean
     *    covert: Boolean,
     *    upgrades: String[]
     *  }
     * or String containing name or id of the card
     * @param {(Object|String)[]} newState - list of cards in play and their states
     */
    set inPlay(newState = []) {
        // First, move all cards in play back to the appropriate decks
        _.each(this.inPlay, (card) => {
            this.moveCard(card, 'deck');
        });
        // Set up each of the cards
        _.each(newState, (card) => {
            if (_.isString(card)) {
                card = this.findCardByName(card, 'deck');
            }

            this.moveCard(card, 'play area');
            card.exhausted = false;
        });
    }

    get deck() {
        return this.player.deck;
    }

    /**
     * Sets the contents of the conflict discard pile
     * @param {String[]} newContents - list of names of cards to be put in conflict discard
     */
    set discard(newContents = []) {
        //  Move cards to the deck
        _.each(this.discard, (card) => {
            this.moveCard(card, 'deck');
        });
        // Move cards to the discard in reverse order
        // (helps with referring to cards by index)
        _.chain(newContents)
            .reverse()
            .each((name) => {
                var card = this.findCardByName(name, 'deck');
                this.moveCard(card, 'discard');
            });
    }

    get discard() {
        return this.player.discard;
    }

    set archives(newContents = []) {
        var cardsInArchives = this.archives;
        _.each(cardsInArchives, (card) => this.moveCard(card, 'deck'));
        let cards = this.mixedListToCardList(newContents, 'deck');
        _.each(cards, (card) => this.moveCard(card, 'archives'));
    }

    get archives() {
        return this.player.archives;
    }

    get opponent() {
        return this.player.opponent;
    }

    replaceLocalizedValues(title) {
        if (!title) {
            return null;
        }

        if (!title.text) {
            return title;
        }

        let result = title.text;
        if (title.values) {
            for (var key in title.values) {
                result = result.replace('{{' + key + '}}', title.values[key]);
            }
        }

        return result;
    }

    currentPrompt() {
        let currentPrompt = this.player.currentPrompt();

        // Replace variable place holders
        let menuTitle = this.replaceLocalizedValues(currentPrompt.menuTitle);
        let promptTitle = this.replaceLocalizedValues(currentPrompt.promptTitle);

        currentPrompt.menuTitle = menuTitle;
        currentPrompt.promptTitle = promptTitle;

        return currentPrompt;
    }

    get currentButtons() {
        var buttons = this.currentPrompt().buttons;
        return _.map(buttons, (button) => this.replaceLocalizedValues(button));
    }

    /**
     * Lists cards selectable by the player during the action
     * @return {DrawCard[]} - selectable cards
     */
    get currentActionTargets() {
        return this.player.promptState.selectableCards;
    }

    /**
     * Lists cards currently selected by the player
     * @return {DrawCard[]} - selected cards
     */
    get selectedCards() {
        return this.player.promptState.selectedCards;
    }

    /**
     * Determines whether a player can initiate actions
     * @return {Boolean} - whether the player can initiate actions or has to wait
     */
    get canAct() {
        return !this.hasPrompt('Waiting for opponent to take an action or pass');
    }

    formatPrompt() {
        var prompt = this.currentPrompt();
        var selectableCards = this.currentActionTargets;

        if (!prompt) {
            return 'no prompt active';
        }

        return (
            prompt.menuTitle +
            '\n' +
            _.map(this.currentButtons, (button) => '[ ' + button + ' ]').join('\n') +
            '\n' +
            _.pluck(selectableCards, 'name').join('\n')
        );
    }

    findCardByName(name, locations = 'any', side) {
        return this.filterCardsByName(name, locations, side)[0];
    }

    /**
     * Filters all of a player's cards using the name and location of a card
     * @param {String} name - the name of the card
     * @param {String[]|String} [locations = 'any'] - locations in which to look for. 'provinces' = 'province 1', 'province 2', etc.
     * @param {?String} side - set to 'opponent' to search in opponent's cards
     */
    filterCardsByName(name, locations = 'any', side) {
        var matchFunc = matchCardByNameAndPack(name);
        // So that function can accept either lists or single locations
        if (locations !== 'any') {
            if (!_.isArray(locations)) {
                locations = [locations];
            }
            // 'provinces' = ['province 1', 'province 2', etc.]
        }

        try {
            var cards = this.filterCards(
                (card) =>
                    matchFunc(card.cardData) &&
                    (locations === 'any' || _.contains(locations, card.location)),
                side
            );
        } catch (e) {
            throw new Error(`Name: ${name}, Locations: ${locations}. Error thrown: ${e}`);
        }

        return cards;
    }

    findCard(condition, side) {
        return this.filterCards(condition, side)[0];
    }

    /**
     *   Filters cards by given condition
     *   @param {function(card: DrawCard)} condition - card matching function
     *   @param {String} [side] - set to 'opponent' to search in opponent's cards
     */
    filterCards(condition, side) {
        var player = this.player;
        if (side === 'opponent') {
            player = this.opponent;
        }

        var cards = player.allCards.filter(condition);
        if (cards.length === 0) {
            throw new Error(`Could not find any matching cards for ${player.name}`);
        }

        return cards;
    }

    putIntoPlay(card) {
        if (_.isString(card)) {
            card = this.findCardByName(card);
        }

        if (card.location !== 'play area') {
            this.player.moveCard(card, 'play area');
        }

        card.facedown = false;
        return card;
    }

    hasPrompt(title) {
        var currentPrompt = this.currentPrompt();
        return (
            !!currentPrompt &&
            ((currentPrompt.menuTitle &&
                currentPrompt.menuTitle.toLowerCase() === title.toLowerCase()) ||
                (currentPrompt.promptTitle &&
                    currentPrompt.promptTitle.toLowerCase() === title.toLowerCase()))
        );
    }

    selectDeck(deck) {
        this.game.selectDeck(this.player.name, deck);
    }

    clickPrompt(text) {
        text = text.toString();
        var currentPrompt = this.player.currentPrompt();
        var promptButton = _.find(currentPrompt.buttons, (button) => {
            return (
                (button.card && button.card.name.toLowerCase() === text.toLowerCase()) ||
                button.text.toString().toLowerCase() === text.toLowerCase()
            );
        });

        if (!promptButton) {
            throw new Error(
                `Couldn't click on "${text}" for ${
                    this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(
            this.player.name,
            promptButton.arg,
            promptButton.uuid,
            promptButton.method
        );
        this.game.continue();
        this.checkUnserializableGameState();
    }

    clickCard(card, location = 'any', side) {
        if (_.isString(card)) {
            card = this.findCardByName(card, location, side);
        }

        this.game.cardClicked(this.player.name, card.uuid);
        this.game.continue();
        this.checkUnserializableGameState();
        return card;
    }

    clickMenu(card, menuText) {
        if (_.isString(card)) {
            card = this.findCardByName(card);
        }

        var items = _.filter(card.getMenu(), (item) => item.text === menuText);

        if (items.length === 0) {
            throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
        }

        this.game.menuItemClick(this.player.name, card.uuid, items[0]);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    selectTrait(trait) {
        let currentPrompt = this.player.currentPrompt();
        let promptControl = currentPrompt.controls.find(
            (control) => control.type.toString().toLowerCase() === 'trait-name'
        );

        if (!promptControl) {
            throw new Error(
                `Couldn't select a trait for ${
                    this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, trait, promptControl.uuid, promptControl.method);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    selectCardName(cardName) {
        let currentPrompt = this.player.currentPrompt();
        let promptControl = currentPrompt.controls.find(
            (control) => control.type.toString().toLowerCase() === 'card-name'
        );

        if (!promptControl) {
            throw new Error(
                `Couldn't select a card name for ${
                    this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, cardName, promptControl.uuid, promptControl.method);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    selectOption(option) {
        let currentPrompt = this.player.currentPrompt();
        let promptButton = currentPrompt.buttons.find((button) => button.arg === option);

        if (!promptButton) {
            throw new Error(
                `Couldn't select an option for ${
                    this.player.name
                }. Current prompt is:\n${this.formatPrompt()}`
            );
        }

        this.game.menuButton(this.player.name, option, promptButton.uuid, promptButton.method);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    endTurn() {
        if (this.currentPrompt().menuTitle !== 'Choose a card to play, discard or use') {
            throw new Error('Cannot end turn now');
        }

        this.clickPrompt('End Turn');
        if (this.currentPrompt().menuTitle === 'Are you sure you want to end your turn?') {
            this.clickPrompt('Yes');
        }
    }

    dragCard(card, targetLocation) {
        this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
        this.game.continue();
        this.checkUnserializableGameState();
    }

    /**
     * Moves cards between Locations
     * @param {String|DrawCard} card - card to be moved
     * @param {String} targetLocation - location where the card should be moved
     * @param {String | String[]} searchLocations - locations where to find the
     * card object, if card parameter is a String
     */
    moveCard(card, targetLocation, searchLocations = 'any') {
        if (_.isString(card)) {
            card = this.mixedListToCardList([card], searchLocations)[0];
        }

        this.player.moveCard(card, targetLocation);
        this.game.continue();
        return card;
    }

    togglePromptedActionWindow(window, value) {
        this.player.promptedActionWindows[window] = value;
    }

    /**
     * Player's action of passing priority
     */
    pass() {
        if (!this.canAct) {
            throw new Error(`${this.name} can't pass, because they don't have priority`);
        }

        this.clickPrompt('Pass');
    }

    checkActions(card) {
        console.log(card.getActions().map((action) => [action.title, action.meetsRequirements()]));
    }

    fightWith(creature, target) {
        if (
            creature.type !== 'creature' ||
            !this.hasPrompt('Choose a card to play, discard or use')
        ) {
            throw new Error(`${creature.name} cannot fight now`);
        }

        this.clickCard(creature);
        this.clickPrompt('Fight with this creature');
        if (target) {
            this.clickCard(target);
        }
    }

    reap(creature) {
        if (
            creature.type !== 'creature' ||
            !this.hasPrompt('Choose a card to play, discard or use')
        ) {
            throw new Error(`${creature.name} cannot reap now`);
        }

        this.clickCard(creature);
        this.clickPrompt('Reap with this creature');
    }

    play(card, left = false, deploy = false) {
        if (card.type === 'creature') {
            this.playCreature(card, left, deploy);
        } else if (card.type === 'artifact') {
            this.clickCard(card);
            this.clickPrompt('Play this artifact');
        } else if (card.type === 'action') {
            this.clickCard(card);
            this.clickPrompt('Play this action');
        }
    }

    useAction(card, omni = false) {
        if (card.type !== 'creature' && card.type !== 'artifact') {
            throw new Error(`${card.name} cannot act`);
        }

        this.clickCard(card);
        this.clickPrompt("Use this card's " + (omni ? 'Omni' : 'Action') + ' ability');
    }

    playUpgrade(upgrade, target) {
        let card = this.clickCard(upgrade, 'hand');
        this.clickPrompt('Play this upgrade');
        this.clickCard(target, 'play area');
        return card;
    }

    playCreature(card, left = false, deploy = false) {
        if (_.isString(card)) {
            card = this.findCardByName(card, 'hand');
        }

        this.clickCard(card, 'hand');
        this.clickPrompt('Play this creature');
        if (this.hasPrompt('Which flank do you want to place this creature on?')) {
            if (left && deploy) {
                this.clickPrompt('Deploy Left');
            } else if (left && !deploy) {
                this.clickPrompt('Left');
            } else if (!left && deploy) {
                this.clickPrompt('Deploy Right');
            } else {
                this.clickPrompt('Right');
            }
        }

        return card;
    }

    /**
     * Converts a mixed list of card objects and card names to a list of card objects
     * @param {(DrawCard|String)[]} mixed - mixed list of cards and names or ids
     * @param {String[]|String} locations - list of locations to get card objects from
     */
    mixedListToCardList(mixed, locations = 'any') {
        if (!mixed) {
            return [];
        }

        // Yank all the non-string cards
        var cardList = _.reject(mixed, (card) => _.isString(card));
        mixed = _.filter(mixed, (card) => _.isString(card));
        // Find cards objects for the rest
        _.each(mixed, (card) => {
            //Find only those cards that aren't already in the list
            var cardObject = this.filterCardsByName(card, locations).find(
                (card) => !_.contains(cardList, card)
            );
            if (!cardObject) {
                throw new Error(`Could not find card named ${card}`);
            }

            cardList.push(cardObject);
        });

        return cardList;
    }

    checkUnserializableGameState() {
        let state = this.game.getState(this.player.name);
        let results = detectBinary(state);

        if (results.length !== 0) {
            throw new Error(
                'Unable to serialize game state back to client:\n' + JSON.stringify(results)
            );
        }
    }

    forgeKey(color) {
        if (this.hasPrompt('Which key would you like to forge?')) {
            this.clickPrompt(color);
        } else {
            throw new Error(`${this.name} does not have a forge key prompt`);
        }
    }

    unforgeKey(color) {
        if (this.hasPrompt('Which key would you like to unforge?')) {
            this.clickPrompt(color);
        } else {
            throw new Error(`${this.name} does not have an unforge key prompt`);
        }
    }

    getForgedKeys() {
        return this.player.getForgedKeys();
    }
}

module.exports = PlayerInteractionWrapper;
