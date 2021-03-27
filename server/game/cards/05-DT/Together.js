const Card = require('../../Card.js');

class Together extends Card {
    //Play: You may play a non-Star Alliance card. If the tide is high, you may play another non-Star Alliance card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                optional: true,
                cardCondition: (card) => !card.hasHouse('staralliance'),
                gameAction: ability.actions.playCard()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isTideHigh(),
                target: {
                    controller: 'self',
                    location: 'hand',
                    optional: true,
                    cardCondition: (card) => !card.hasHouse('staralliance'),
                    gameAction: ability.actions.playCard()
                }
            }
        });
    }
}

Together.id = 'together';

module.exports = Together;
