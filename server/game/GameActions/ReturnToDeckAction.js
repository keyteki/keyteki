const CardGameAction = require('./CardGameAction');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.bottom = false;
        this.shuffle = false;
    }

    setup() {
        super.setup();
        this.name = 'returnToDeck';
        if(this.shuffle) {
            this.effectMsg = 'return {0} to their deck';
        } else {
            this.effectMsg = 'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
        }
    }

    getEvent(card, context) {
        if(card.location === 'play area') {
            return super.createEvent('onCardLeavesPlay', { card, context }, () => {
                card.owner.moveCard(card, 'deck', { bottom: this.bottom });
                if(this.shuffle && (this.target.findIndex(c => c === card) === this.target.length - 1)) {
                    card.owner.shuffleDeck();
                }
            });
        }

        return super.createEvent('onMoveCard', { card: card, context: context }, () => {
            card.owner.moveCard(card, 'deck', { bottom: this.bottom });
            if(this.shuffle && (this.target.findIndex(c => c === card) === this.target.length - 1)) {
                card.owner.shuffleDeck();
            }
        });
    }
}

module.exports = ReturnToDeckAction;
