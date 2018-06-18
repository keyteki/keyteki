const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setDefaultProperties() {
        this.location = '';
    }
    setup() {
        super.setup();
        this.name = 'discardCard';
        this.effectMsg = 'discard {0}';
        this.cost = 'discarding {0}';
    }

    canAffect(card, context) {
        if(this.location && card.location !== this.location) {
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
        return [this.createEvent('onCardsDiscarded', { player: this.target[0].controller, cards: this.target, context: context }, event => {
            for(const card of event.cards) {
                card.controller.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            }
        })];
    }

    getEvent(card, context) {
        let handler = () => card.controller.moveCard(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
        return super.createEvent('onCardsDiscarded', { player: card.controller, cards: [card], context: context }, handler);
    }
}

module.exports = DiscardCardAction;
