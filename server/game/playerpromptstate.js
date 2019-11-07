const _ = require('underscore');

class PlayerPromptState {
    constructor(player) {
        this.player = player;
        this.selectCard = false;
        this.selectOrder = false;
        this.menuTitle = '';
        this.promptTitle = '';
        this.buttons = [];
        this.controls = [];

        this.selectableCards = [];
        this.cardDamage = {};
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
        this.selectOrder = prompt.selectOrder || false;
        this.cardDamage = prompt.cardDamage || {};
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
        this.cardDamage = {};
        this.menuTitle = '';
        this.buttons = [];
        this.controls = [];
    }

    getCardSelectionState(card) {
        let selectable = this.selectableCards.includes(card);
        let damage = this.cardDamage[card.uuid] || 0;
        return {
            selected: this.selectedCards && this.selectedCards.includes(card),
            selectable: selectable,
            unselectable: !selectable && this.selectCard,
            pseudoDamage: card.warded ? 0 : damage,
            wardBroken: damage > 0 && card.warded
        };
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
