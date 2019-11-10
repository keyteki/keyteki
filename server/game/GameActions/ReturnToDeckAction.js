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
        let readyToShuffle = this.shuffle && !this.target.slice(this.target.findIndex(c => c === card) + 1, this.target.length).some(c => c.owner === card.owner);

        return super.createEvent(eventName, { card: card, context: context, shuffle: readyToShuffle }, event => {
            card.owner.moveCard(card, 'deck', { bottom: this.bottom });
            if(event.shuffle) {
                card.owner.shuffleDeck();
            }
        });
    }
}

module.exports = ReturnToDeckAction;
