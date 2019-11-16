const Card = require('../../Card.js');

class CrashMuldoon extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.ready()
        });
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card) && card.exhausted === false && !card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            },
            effect: 'use a neighboring non staralliance creature'
        });
    }
}

CrashMuldoon.id = 'crash-muldoon';

module.exports = CrashMuldoon;
