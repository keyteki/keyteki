const CardGameAction = require('./CardGameAction');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.switch = false;
        this.shuffle = false;
    }

    setup() {
        super.setup();
        this.name = 'move';
        this.effectMsg = 'move {0}';
    }

    canAffect(card, context) {
        if(card.location === 'play area' || !card.controller.getSourceList(this.destination)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onMoveCard', { card: card, context: context }, () => {
            context.player.moveCard(card, this.destination);
            if(this.shuffle) {
                if(this.destination === 'deck') {
                    context.player.shuffleDeck();
                }
            }
        });
    }
}

module.exports = MoveCardAction;
