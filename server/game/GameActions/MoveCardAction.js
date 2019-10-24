const CardGameAction = require('./CardGameAction');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.reveal = false;
        this.shuffle = false;
    }

    setup() {
        super.setup();
        this.name = 'move';
        this.effectMsg = `move ${this.reveal ? '{0}' : 'a card'} to their ${this.destination}`;
    }

    canAffect(card, context) {
        if(card.location === 'play area' || !card.controller.getSourceList(this.destination)) {
            return false;
        }

        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onMoveCard', { card: card, context: context }, event => {
            context.player.moveCard(event.card, this.destination);
            if(this.shuffle && (this.target.findIndex(c => c === event.card) === this.target.length - 1)) {
                context.player.shuffleDeck();
            }
        });
    }
}

module.exports = MoveCardAction;
