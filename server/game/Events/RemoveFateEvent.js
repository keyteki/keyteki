const Event = require('./Event.js');

class RemoveFateEvent extends Event {
    constructor(params) {
        super('onCardRemoveFate', params);
        this.handler = this.removeFate;
        this.gameAction = 'removeFate';
        this.addFateEvent = null;
    }

    createContingentEvents() {
        if(this.recipient && this.recipient.type === 'character') {
            this.addFateEvent = this.recipient.game.getEventsForGameAction(this.context, { placeFate: this.recipient })[0];
            this.addFateEvent.order = this.order + 1;
            this.addFateEvent.condition = () => !this.cancelled;
            return [this.addFateEvent];
        }
        return [];
    }
    
    removeFate() {
        let fate = Math.min(this.fate, this.card.fate);
        this.card.fate -= fate;
        if(this.addFateEvent) {
            this.addFateEvent.fate = fate;
        } else if(this.recipient && this.recipient.modifyFate) {
            this.recipient.modifyFate(fate);
        }
    }
}

module.exports = RemoveFateEvent;
