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
                    contingentEvents.push(new LeavesPlayEvent({
                        order: this.order - 1,
                        destination: attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile',
                        condition: () => attachment.parent === this.card
                    }, attachment));
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
        if(this.card.isAncestral()) {
            this.destination = 'hand';
            this.card.game.addMessage('{0} returns to {1}\'s hand due to its Ancestral keyword', this.card, this.card.owner);
        }
    }

    leavesPlay() {
        this.card.owner.moveCard(this.card, this.destination, this.options);
        if(this.options.shuffle) {
            if(this.destination === 'dynasty deck') {
                this.card.owner.shuffleDynastyDeck();
            } else if(this.destination === 'conflict deck') {
                this.card.owner.shuffleConflictDeck();
            }
        }
    }
}


module.exports = LeavesPlayEvent;
