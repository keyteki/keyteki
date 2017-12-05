const _ = require('underscore');
const Event = require('./Event.js');
const RemoveFateEvent = require('./RemoveFateEvent.js');

class LeavesPlayEvent extends Event {
    constructor(params) {
        super('onCardLeavesPlay', params);
        this.handler = this.leavesPlay;

        if(!this.destination) {
            this.destination = this.card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
        }
    }
    
    createContingentEvents() {
        let contingentEvents = [];
        // Add an imminent triggering condition for all attachments leaving play
        if(this.card.attachments) {
            this.card.attachments.each(attachment => {
                // we only need to add events for attachments that are in play.
                if(attachment.location === 'play area') {
                    let destination = attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile';
                    destination = attachment.isAncestral() ? 'hand' : destination;
                    let event = new LeavesPlayEvent({ card: attachment, destination: destination });
                    event.order = this.order - 1;
                    contingentEvents.push(event);
                }
            });
        }
        // Add an imminent triggering condition for removing fate
        if(this.card.fate > 0) {
            let fateEvent = new RemoveFateEvent({ card: this.card, fate: this.card.fate });
            fateEvent.order = this.order - 1;
            contingentEvents.push(fateEvent);
        }
        return contingentEvents;
    }
    
    preResolutionEffect() {
        this.cardStateWhenLeftPlay = this.card.createSnapshot();
        // need to do leavesPlayEffects here before any attachments are discarded and we lose their persistent effects
        this.card.leavesPlayEffects();
    }

    leavesPlay() {
        this.card.owner.moveCard(this.card, this.destination);
        return { resolved: true, success: true };
    }
}

module.exports = LeavesPlayEvent;
