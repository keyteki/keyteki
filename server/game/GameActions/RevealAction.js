const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setDefaultProperties() {
        this.chatMessage = false;
    }
    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        let testLocations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    checkEventCondition() {
        return true;
    }

    getEventArray(context) {
        if(this.target.length === 0) {
            return [];
        }
        return [this.createEvent('onCardsRevealed', { cards: this.target, context: context }, event => {
            if(this.chatMessage) {
                context.game.addMessage('{0} reveals {1}', context.source, event.cards);
            }
        })];
    }

    getEvent(card, context) {
        return super.createEvent('onCardRevealed', { card: card, context: context }, () => {
            if(this.chatMessage) {
                context.game.addMessage('{0} reveals {1}', context.source, card);
            }
        });
    }
}

module.exports = RevealAction;
