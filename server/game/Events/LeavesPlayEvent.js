const Event = require('./Event.js');
const MoveFateEvent = require('./MoveFateEvent.js');

class LeavesPlayEvent extends Event {
    constructor(params, card, gameAction) {
        super('onCardLeavesPlay', params);
        this.handler = this.leavesPlay;
        this.gameAction = gameAction;
        this.card = card;
        this.options = params.options || {};

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
                    if(attachment.isAncestral()) {
                        destination = 'hand';
                        attachment.game.addMessage('{0} returns to {1}\'s hand due to its Ancestral keyword', attachment, attachment.owner);
                    }
                    contingentEvents.push(new LeavesPlayEvent({ order: this.order - 1, destination: destination, isContingent: true }, attachment));
                }
            });
        }
        // Add an imminent triggering condition for removing fate
        if(this.card.fate > 0) {
            contingentEvents.push(new MoveFateEvent({ order: this.order - 1 }, this.card.fate, this.card));
        }
        return contingentEvents;
    }

    preResolutionEffect() {
        this.cardStateWhenLeftPlay = this.card.createSnapshot();
    }

    leavesPlay() {
        this.card.owner.moveCard(this.card, this.destination, this.options);
        if(this.options.shuffle) {
            this.card.owner.shuffleConflictDeck();
        }
    }
}

module.exports = LeavesPlayEvent;
