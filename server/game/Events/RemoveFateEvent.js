const _ = require('underscore');
const Event = require('./Event.js');

class RemoveFateEvent extends Event {
    constructor(params) {
        super('onCardRemoveFate', params);
        this.handler = this.removeFate;
    }
    
    removeFate() {
        let fate = Math.min(this.fate, this.card.fate);
        this.card.fate -= fate;
        if(this.recipient && _.isNumber(this.recipient.fate)) {
            this.recipient.fate += fate;
        }
        return true;
    }
}

module.exports = RemoveFateEvent;
