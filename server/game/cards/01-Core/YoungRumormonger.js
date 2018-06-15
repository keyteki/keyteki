const DrawCard = require('../../drawcard.js');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: event => event.gameAction.name === 'honor',
                onCardDishonored: event => event.gameAction.name === 'dishonor'
            },
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card !== context.event.card && card.controller === context.event.card.controller &&
                                                  card.allowGameAction(context.event.gameAction.action, context)
            },
            effect: '{1} {0} instead of {2}',
            effectArgs: context => [context.event.gameAction.name, context.event.card],
            handler: context => {
                let newEvent = context.event.gameAction.getEvent(context.target, context);
                context.event.getResult = () => newEvent.getResult();
                context.event.window.addEvent(newEvent);
                context.cancel();
            }
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
