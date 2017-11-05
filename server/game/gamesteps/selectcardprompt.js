const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');
const CardSelector = require('../CardSelector.js');
const AbilityContext = require('../AbilityContext.js');

/**
 * General purpose prompt that asks the user to select 1 or more cards.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards the player
 *                      must select. Set to 0 if there is no limit on the num
 *                      of cards that can be selected.
 * multiSelect        - boolean that ensures that the selected cards are sent as
 *                      an array, even if the numCards limit is 1.
 * buttons            - array of buttons for the prompt. Defaults to a single 
 *                      'Done' button
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * maxStat            - a function that returns the maximum value that cards
 *                      selected by the prompt cannot exceed. If not specified,
 *                      then no stat limiting is done on the prompt.
 * cardStat           - a function that takes a card and returns a stat value.
 *                      Used for prompts that have a maximum stat value.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * onSelect           - a callback that is called once all cards have been
 *                      selected. On single card prompts this is called as soon
 *                      as an elligible card is clicked. On multi-select prompts
 *                      it is called when the done button is clicked. If the
 *                      callback does not return true, the prompt is not marked
 *                      as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any cards.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * gameAction         - a string representing the game action to be checked on
 *                      target cards.
 * ordered            - an optional boolean indicating whether or not to display
 *                      the order of the selection during the prompt.
 */
class SelectCardPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }

        this.properties = properties;
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: properties.source });
        _.defaults(this.properties, this.defaultProperties());
        this.selector = properties.selector || CardSelector.for(properties);
        this.selectedCards = [];
        this.savePreviouslySelectedCards();
    }

    defaultProperties() {
        return {
            buttons: [{ text: 'Done', arg: 'done' }],
            pretarget: false,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true
        };
    }

    savePreviouslySelectedCards() {
        this.previouslySelectedCards = this.choosingPlayer.selectedCards;
        this.choosingPlayer.clearSelectedCards();
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        let selectableCards = this.game.allCards.filter(card => {
            return this.checkCardCondition(card);
        });
        this.choosingPlayer.setSelectableCards(selectableCards);
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        return {
            selectCard: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.selector.defaultActivePromptTitle(),
            buttons: this.properties.buttons,
            promptTitle: this.properties.source ? this.properties.source.name : undefined,
            controls: this.properties.controls
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(this.selector.automaticFireOnSelect() && this.selector.hasReachedLimit(this.selectedCards)) {
            this.fireOnSelect();
        }
    }

    checkCardCondition(card) {
        // Always allow a card to be unselected
        if(this.selectedCards.includes(card)) {
            return true;
        }

        return (
            this.selector.canTarget(card, this.context, this.properties.pretarget) &&
            !this.selector.wouldExceedLimit(this.selectedCards, card)
        );
    }

    selectCard(card) {
        if(this.selector.hasReachedLimit(this.selectedCards) && !this.selectedCards.includes(card)) {
            return false;
        }

        if(!this.selectedCards.includes(card)) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards = _.reject(this.selectedCards, c => c === card);
        }
        this.choosingPlayer.setSelectedCards(this.selectedCards);

        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect() {
        let cardParam = this.selector.formatSelectParam(this.selectedCards);
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
        } else {
            this.clearSelection();
        }
    }

    menuCommand(player, arg) {
        if(arg !== 'done') {
            if(this.properties.onMenuCommand(player, arg)) {
                this.complete();
            }
            return;
        }

        if(this.selector.hasEnoughSelected(this.selectedCards)) {
            this.fireOnSelect();
        } else if(this.selectedCards.length === 0) {
            this.properties.onCancel(player);
            this.complete();
        }
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.selectedCards = [];
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();

        // Restore previous selections.
        this.choosingPlayer.setSelectedCards(this.previouslySelectedCards);
    }
}

module.exports = SelectCardPrompt;
