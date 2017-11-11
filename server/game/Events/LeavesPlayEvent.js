const Event = require('./Event.js');
const RemoveFateEvent = require('./RemoveFateEvent.js');

class LeavesPlayEvent extends Event {
    constructor(params, isSacrifice = false) {
        super('onCardLeavesPlay', params);
        this.isSacrifice = isSacrifice;
        this.handler = this.leavesPlay;
        this.contigentEvents = [];
        if(!this.destination) {
            this.destination = this.card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
        }
    }
    
    setWindow(window) {
        super.setWindow(window);
        // Add an imminent triggering condition for all attachments leaving play
        if(this.card.attachments) {
            this.card.attachments.each(attachment => {
                let destination = attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
                destination = attachment.isAncestral() ? 'hand' : destination;
                let event = new LeavesPlayEvent({ card: attachment, destination: destination });
                event.order = this.order - 1;
                window.addEvent(event);
                this.contigentEvents.push(event);
            });
        }
        // Add an imminent triggering condition for removing fate
        if(this.card.fate > 0) {
            let fateEvent = new RemoveFateEvent({ card: this.card, fate: this.card.fate });
            fateEvent.order = this.order - 1;
            window.addEvent(fateEvent);
            this.contigentEvents.push(fateEvent);
        }
    }
    
    cancel() {
        this.contingentEvents.each(event => event.cancelled = true);
        this.window.removeEvent(this.contingentEvents);
        this.contingentEvents = [];
        super.cancel();
    }
    
    leavesPlay() {
        this.cardStateWhenLeftPlay = this.card.createSnapshot(); 
        this.card.owner.moveCard(this.card, this.destination);
        return true;
    }
}

module.exports = LeavesPlayEvent;
