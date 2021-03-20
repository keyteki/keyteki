const Card = require('../../Card.js');

class RocketeerTryska extends Card {
    //While the tide is high, Rocketeer Tryska's neighbors enter play ready.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' &&
                    context.source.neighbors.includes(event.card) &&
                    context.source.controller.isTideHigh()
            },
            gameAction: ability.actions.ready((context) => ({
                target: context.event.card
            }))
        });
    }
}

RocketeerTryska.id = 'rocketeer-tryska';

module.exports = RocketeerTryska;
