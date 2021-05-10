const Card = require('../../Card.js');

class ThrowingStars extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ).length
                })),
                message: '{0} gains amber for each creature destroyed this way'
            }
        });
    }
}

ThrowingStars.id = 'throwing-stars';

module.exports = ThrowingStars;
