const Card = require('../../Card.js');

class BlastFromThePast extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exalt()
            },
            then: {
                alwaysTriggers: true,
                message: '{0} uses {1} to archive {2}',
                target: {
                    cardType: 'creature',
                    location: 'discard',
                    cardCondition: (card) => card.hasHouse('saurian'),
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                then: (context) => ({
                    message: '{0} uses {1} to deal {3} damage to {2}',
                    messageArgs: (context) => [context.target.power],
                    target: {
                        cardType: 'creature',
                        controller: 'opponent',
                        gameAction: ability.actions.dealDamage({ amount: context.target.power })
                    }
                })
            }
        });
    }
}

BlastFromThePast.id = 'blast-from-the-past';

module.exports = BlastFromThePast;
