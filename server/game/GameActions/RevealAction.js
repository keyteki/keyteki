const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setDefaultProperties() {
        this.chatMessage = false;
    }

    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal a card';
        this.cost = 'revealing {0}';
    }

    canAffect(card, context) {
        let testLocations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let eventName = 'onCardRevealed';
        if(card.type === 'province') {
            eventName = 'onProvinceRevealed';
        }
        return super.createEvent(eventName, { card, context }, event => {
            if(this.chatMessage) {
                context.game.addMessage('{0} reveals {1}', context.source, card);
            }
            event.card.facedown = false;
        });
    }
}

module.exports = RevealAction;
