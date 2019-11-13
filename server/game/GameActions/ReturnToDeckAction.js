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
        let eventName = (card.location === 'play area') ? 'onCardLeavesPlay' : 'onMoveCard';

        return super.createEvent(eventName, { card: card, context: context }, () => {
            card.owner.moveCard(card, 'deck', { bottom: this.bottom });
            let cardsByOwner = this.target.filter(c => c.owner === card.owner);
            if(this.shuffle && cardsByOwner.findIndex(c => c === card) === cardsByOwner.length - 1) {
                card.owner.shuffleDeck();
            }
        });
    }
}

module.exports = ReturnToDeckAction;
