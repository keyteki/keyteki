const Event = require('./Event.js');

class RemoveFateEvent extends Event {
    constructor(params) {
        super('onCardRemoveFate', params);
        this.handler = this.removeFate;
        this.gameAction = 'removeFate';
    }
    
    removeFate() {
        let fate = Math.min(this.fate, this.card.fate);
        this.card.fate -= fate;
        if(this.recipient && this.recipient.modifyFate && this.recipient.allowGameAction('placeFate', this.context)) {
            this.recipient.modifyFate(fate);
            // TODO: This hack allows RemoveFateEvents to trigger reactions to fate being placed (e.g. Ikoma Prodigy)
            this.addThenEvent(this.card.game.getEvent('onCardAddFate', { card: this.card, context: this.context, fate: fate }));
        }
    }
}

module.exports = RemoveFateEvent;
