import Card from '../../Card.js';

class Together extends Card {
    // (T) Play: You may play a non-Star Alliance card. If the tide is high, you may play another non-Star Alliance card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('staralliance'),
                gameAction: ability.actions.playCard()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isTideHigh(),
                target: {
                    optional: true,
                    controller: 'self',
                    location: 'hand',
                    cardCondition: (card) => !card.hasHouse('staralliance'),
                    gameAction: ability.actions.playCard()
                }
            }
        });
    }
}

Together.id = 'together';

export default Together;
