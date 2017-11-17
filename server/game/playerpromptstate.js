const _ = require('underscore');

class PlayerPromptState {
    constructor() {
        this.selectCard = false;
        this.selectOrder = false;
        this.selectRing = false;
        this.menuTitle = '';
        this.promptTitle = '';
        this.buttons = [];
        this.controls = [];

        this.selectableCards = [];
        this.selectableRings = [];
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

    setSelectableRings(rings) {
        console.log('setting selectable rings', rings)
        this.selectableRings = rings;
    }

    clearSelectableRings() {
        this.selectableRings = [];
    }

    setPrompt(prompt) {
        this.selectCard = prompt.selectCard || false;
        this.selectOrder = prompt.selectOrder || false;
        this.selectRing = prompt.selectRing || false;
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
        this.selectRing = false;
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
            unselectable: this.selectCard && !selectable
        };

        if(index !== -1 && this.selectOrder) {
            return _.extend({ order: index + 1 }, result);
        }

        return result;
    }

    getRingSelectionState(ring) {
        return { unselectable: this.selectRing && !this.selectableRings.includes(ring) };
    }

    getState() {
        return {
            selectCard: this.selectCard,
            selectOrder: this.selectOrder,
            selectRing: this.selectRing,
            menuTitle: this.menuTitle,
            promptTitle: this.promptTitle,
            buttons: this.buttons,
            controls: this.controls
        };
    }
}

module.exports = PlayerPromptState;
