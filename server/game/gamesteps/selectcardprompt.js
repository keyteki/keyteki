const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');

/**
 * General purpose prompt that asks the user to select 1 or more cards.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards the player
 *                      must select. Set to 0 if there is no limit on the num
 *                      of cards that can be selected.
 * additionalButtons  - array of additional buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
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
 */
class SelectCardPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);
        this.choosingPlayer = choosingPlayer;
        this.properties = properties;
        _.defaults(this.properties, this.defaultProperties());
        this.selectedCards = [];
        this.savePreviouslySelectedCards();
    }

    defaultProperties() {
        return {
            numCards: 1,
            additionalButtons: [],
            cardCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true
        };
    }

    savePreviouslySelectedCards() {
        this.previouslySelectedCards = this.game.allCards.filter(card => card.selected || card.opponentSelected);
        _.each(this.previouslySelectedCards, card => {
            if(card.controller !== this.choosingPlayer) {
                card.opponentSelected = false;
            } else {
                card.selected = false;
            }
        });
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        return {
            selectCard: true,
            menuTitle: this.properties.activePromptTitle || this.defaultActivePromptTitle(),
            buttons: this.properties.additionalButtons.concat([
                { text: 'Done', arg: 'done' }
            ])
        };
    }

    defaultActivePromptTitle() {
        return this.properties.numCard === 1 ? 'Select a card' : ('Select ' + this.properties.numCard + ' cards');
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.properties.cardCondition(card)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(this.properties.numCards === 1 && this.selectedCards.length === 1) {
            this.fireOnSelect();
        }
    }

    selectCard(card) {
        if(this.properties.numCards !== 0 && this.selectedCards.length >= this.properties.numCards && !_.contains(this.selectedCards, card)) {
            return false;
        }

        if(this.choosingPlayer !== card.controller) {
            card.opponentSelected = !card.opponentSelected;
        } else {
            card.selected = !card.selected;
        }

        if(card.selected || card.opponentSelected) {
            this.selectedCards.push(card);
        } else {
            this.selectedCards = _.reject(this.selectedCards, c => c === card);
        }

        if(this.properties.onCardSelected) {
            this.properties.onCardSelected(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect() {
        var cardParam = (this.properties.numCards === 1) ? this.selectedCards[0] : this.selectedCards;
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
        }
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(arg !== 'done') {
            if(this.properties.onMenuCommand(player, arg)) {
                this.complete();
            }
            return;
        }

        if(this.selectedCards.length > 0) {
            this.fireOnSelect();
        } else {
            this.properties.onCancel(player);
            this.complete();
        }
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        _.each(this.selectedCards, card => {
            card.selected = false;
            card.opponentSelected = false;
        });
        
        // Restore previous selections.
        _.each(this.previouslySelectedCards, card => {
            if(card.controller !== this.choosingPlayer) {
                card.opponentSelected = true;
            } else {
                card.selected = true;
            }
        });
    }
}

module.exports = SelectCardPrompt;
