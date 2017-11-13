const _ = require('underscore');
const Event = require('./Event.js');
const RemoveFateEvent = require('./RemoveFateEvent.js');

class LeavesPlayEvent extends Event {
    constructor(params) {
        super('onCardLeavesPlay', params);
        this.handler = this.leavesPlay;
        this.contingentEvents = [];

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
                this.contingentEvents.push(event);
            });
        }
        // Add an imminent triggering condition for removing fate
        if(this.card.fate > 0) {
            let fateEvent = new RemoveFateEvent({ card: this.card, fate: this.card.fate });
            fateEvent.order = this.order - 1;
            window.addEvent(fateEvent);
            this.contingentEvents.push(fateEvent);
        }
    }
    
    cancel() {
        _.each(this.contingentEvents, event => event.cancelled = true);
        this.window.removeEvent(this.contingentEvents);
        this.contingentEvents = [];
        super.cancel();
    }
    
    preResolutionEffect() {
        this.cardStateWhenLeftPlay = this.card.createSnapshot();
    }

    leavesPlay() {
        this.cardStateWhenLeftPlay.leavesPlayEffects(); 
        this.card.owner.moveCard(this.card, this.destination);
        return true;
    }
}

module.exports = LeavesPlayEvent;
