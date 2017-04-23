const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * Prompt that will search the player's deck, present them with matching cards,
 * them do something with the chosen card. Whether the player chooses a card or
 * cancels the prompt, their deck will be shuffled.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards that will be
 *                      searched within the player's deck. If not specified, the
 *                      entire deck will be searched.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * onSelect           - a callback that is called once the player chooses a
 *                      card.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without choosing a card.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class DeckSearchPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        if(properties.source && !properties.waitingPromptTitle) {
            this.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }

        this.properties = properties;
        _.defaults(this.properties, this.defaultProperties());
        if(!_.isArray(this.properties.cardType)) {
            this.properties.cardType = [this.properties.cardType];
        }
    }

    defaultProperties() {
        return {
            cardCondition: () => true,
            cardType: ['attachment', 'character', 'event', 'location'],
            onSelect: () => true,
            onCancel: () => true
        };
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        return {
            menuTitle: this.properties.activePromptTitle || 'Choose a card',
            buttons: this.buttons(),
            promptTitle: this.properties.source ? this.properties.source.name : undefined
        };
    }

    buttons() {
        let uniqueCardsByTitle = _.uniq(this.searchCards(), card => card.cardData.label);
        let buttons = _.map(uniqueCardsByTitle, card => {
            return { text: card.cardData.label, arg: card.uuid, card: card.getSummary(true) };
        });
        buttons.push({ text: 'Done', arg: 'done' });
        return buttons;
    }

    searchCards() {
        if(this.properties.numCards) {
            return this.choosingPlayer.searchDrawDeck(this.properties.numCards, card => this.checkCardCondition(card));
        }
        return this.choosingPlayer.searchDrawDeck(card => this.checkCardCondition(card));
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    checkCardCondition(card) {
        return this.properties.cardType.includes(card.getType()) && this.properties.cardCondition(card);
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(arg === 'done') {
            this.cancelAndShuffle(player);
            return;
        }

        let card = player.findCardByUuid(player.drawDeck, arg);

        if(!card) {
            return false;
        }

        this.selectAndShuffle(player, card);
    }

    cancelAndShuffle(player) {
        this.properties.onCancel(player);
        player.shuffleDrawDeck();
        this.game.addMessage('{0} shuffles their deck', player);
        this.complete();
    }

    selectAndShuffle(player, card) {
        this.properties.onSelect(player, card);
        player.shuffleDrawDeck();
        this.game.addMessage('{0} shuffles their deck', player);
        this.complete();
    }
}

module.exports = DeckSearchPrompt;
