const _ = require('underscore');

class PlayerPromptState {
    constructor(player) {
        this.player = player;
        this.selectCard = false;
        this.selectMyCard = false;
        this.selectOrder = false;
        this.menuTitle = '';
        this.promptTitle = '';
        this.buttons = [];
        this.controls = [];

        this.selectableCards = [];
        this.selectedCards = [];
    }

    setSelectedCards(cards) {
        this.selectedCards = cards;
    }

    clearSelectedCards() {
        this.selectedCards = [];
    }

    setSelectableCards(cards) {
        this.selectableCards = cards;
    }

    clearSelectableCards() {
        this.selectableCards = [];
    }

    setPrompt(prompt) {
        this.selectCard = prompt.selectCard || false;
        this.selectMyCard = prompt.selectMyCard || false;
        this.selectOrder = prompt.selectOrder || false;
        this.menuTitle = prompt.menuTitle || '';
        this.promptTitle = prompt.promptTitle;
        this.buttons = _.map(prompt.buttons || [], button => {
            if(button.card) {
                let card = button.card;
                let properties = _.omit(button, 'card');
                return _.extend({ text: card.name, arg: card.uuid, card: card.getShortSummary() }, properties);
            }

            return button;
        });
        this.controls = prompt.controls || [];
    }

    cancelPrompt() {
        this.selectCard = false;
        this.menuTitle = '';
        this.buttons = [];
        this.controls = [];
    }

    getCardSelectionState(card) {
        let selectable = this.selectableCards.includes(card);
        let index = _.indexOf(this.selectedCards, card);
        let result = {
            // The `card.selected` property here is a hack for plot selection,
            // which we do differently from normal card selection.
            selected: card.selected || (index !== -1),
            selectable: selectable,
            unselectable: (this.selectCard && !selectable) || (this.selectMyCard && !selectable && card.controller === this.player)
        };

        if(index !== -1 && this.selectOrder) {
            return _.extend({ order: index + 1 }, result);
        }

        return result;
    }

    getState() {
        return {
            selectCard: this.selectCard,
            selectOrder: this.selectOrder,
            menuTitle: this.menuTitle,
            promptTitle: this.promptTitle,
            buttons: this.buttons,
            controls: this.controls
        };
    }
}

module.exports = PlayerPromptState;
