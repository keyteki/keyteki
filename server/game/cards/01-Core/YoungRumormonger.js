const DrawCard = require('../../drawcard.js');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: event => event.gameAction === 'honor',
                onCardDishonored: event => event.gameAction === 'dishonor'
            },
            canCancel: true,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card !== context.event.card && 
                                                  card.controller === context.event.card.controller && 
                                                  card.allowGameAction(context.event.gameAction, context)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to {2} {3} instead of {4}', this.controller, this, context.event.gameAction, context.target, context.event.card);
                let newEvent = this.game.getEventsForGameAction(context.event.gameAction, context.target, context)[0];
                context.event.window.addEvent(newEvent);
                context.event.getResult = newEvent.getResult;
                context.cancel();
            } 
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
