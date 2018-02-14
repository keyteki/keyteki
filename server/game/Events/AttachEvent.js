const Event = require('./Event.js');
const EntersPlayEvent = require('./EntersPlayEvent');

class AttachEvent extends Event {
    constructor(params) {
        super('onCardAttached', params);
        this.handler = this.attach;
        this.gameAction = 'attach';
    }

    createContingentEvents() {
        if(this.card.location === 'play area') {
            return [];
        }
        return [new EntersPlayEvent({ card: this.card, context: this.context, gameAction: 'putIntoPlay', order: this.order - 1 })];
    }
    
    attach() {
        if(this.card.location === 'play area') {
            this.card.parent.removeAttachment(this.card);
            this.card.parent = this.parent;
            this.parent.attachments.push(this.card);
        } else {
            this.card.owner.removeFromPile(this.card);
            this.card.parent = this.parent;
            this.parent.attachments.push(this.card);
            this.card.moveTo('play area');
        }

        this.context.game.queueSimpleStep(() => {
            if(_.size(this.parent.attachments.filter(c => c.isRestricted())) > 2) {
                this.context.game.promptForSelect(this.parent.controller, {
                    activePromptTitle: 'Choose a card to discard',
                    waitingPromptTitle: 'Waiting for opponent to choose a card to discard',
                    cardCondition: card => card.parent === this.parent && card.isRestricted(),
                    onSelect: (player, card) => {
                        this.context.game.addMessage('{0} discards {1} from {2} due to too many Restricted attachments', player, card, card.parent);
                        player.game.applyGameAction(this.context, { discardFromPlay: card });
                        return true;
                    },
                    source: 'Too many Restricted attachments'
                });
            }
        });
    }
}

module.exports = RemoveFateEvent;
