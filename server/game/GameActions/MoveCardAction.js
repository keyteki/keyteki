const CardGameAction = require('./CardGameAction');

class MoveCardAction extends CardGameAction {
    setDefaultProperties() {
        this.destination = '';
        this.switch = false;
        this.shuffle = false;
    }

    setup() {
        this.name = 'move';
        this.targetType = ['character', 'attachment', 'event', 'holding'];
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
            if(this.switch) {
                // This is somewhat convoluted in order to avoid triggering refilling the province
                let otherCard = card.controller.getDynastyCardInProvince(this.destination);
                if(otherCard) {
                    card.controller.removeCardFromPile(otherCard);
                    otherCard.moveTo(card.location);
                    let sourcePile = card.controller.getSourceList(card.location);
                    sourcePile.push(otherCard);
                }
            }
            context.player.moveCard(card, this.destination);
            if(this.shuffle) {
                if(this.destination === 'conflict deck') {
                    context.player.shuffleConflictDeck();
                } else if(this.destination === 'dynasty deck') {
                    context.player.shuffleDynastyDeck();
                }
            }
        });
    }
}

module.exports = MoveCardAction;
