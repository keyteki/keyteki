const CardGameAction = require('./CardGameAction');
const LeavesPlayEvent = require('../Events/LeavesPlayEvent');

class ReturnToDeckAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'play area';
        this.bottom = false;
        this.shuffle = false;
    }

    setup() {
        this.name = 'returnToDeck';
        this.targetType = ['character', 'attachment', 'event', 'holding'];
        this.effectMsg = 'return {0} to the ' + (this.bottom ? 'bottom' : 'top') + ' of their deck';
    }

    canAffect(card, context) {
        if(card.location !== this.location) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let destination = card.isDynasty ? 'dynasty deck' : 'conflict deck';
        if(this.location === 'play area') {
            return new LeavesPlayEvent({ context: context, destination: destination, options: { bottom: this.bottom, shuffle: this.shuffle } }, card, this);
        }
        return super.createEvent('onMoveCard', { card: card, context: context }, () => {
            card.owner.moveCard(card, 'hand', { bottom: this.bottom });
            if(this.shuffle) {
                if(destination === 'dynasty deck') {
                    card.owner.shuffleDynastyDeck();
                } else {
                    card.owner.shuffleConflictDeck();
                }
            }
        });
    }
}

module.exports = ReturnToDeckAction;
