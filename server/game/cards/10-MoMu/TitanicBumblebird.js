const GiganticCard = require('../../GiganticCard.js');

class TitanicBumblebird extends GiganticCard {
    // (Play only with the other half of Titanic Bumblebird.)
    // Play/After Reap: Destroy an enemy creature. If you do, give +1 power
    // counters equal to the destroyed creatures power to a friendly creature.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.addPowerCounter((context) => ({
                        amount:
                            context.preThenEvents.length > 0 && context.preThenEvents[0].clone
                                ? context.preThenEvents[0].clone.modifiedPower
                                : 0
                    }))
                },
                message: '{0} uses {1} to give {3} power counter{4} to {5}',
                messageArgs: (context) => [
                    context.preThenEvents.length > 0 && context.preThenEvents[0].clone
                        ? context.preThenEvents[0].clone.modifiedPower
                        : 0,
                    context.preThenEvents.length > 0 && context.preThenEvents[0].clone
                        ? context.preThenEvents[0].clone.modifiedPower == 1
                            ? ''
                            : 's'
                        : 's',
                    context.target
                ]
            }
        });
    }
}

TitanicBumblebird.id = 'titanic-bumblebird';

module.exports = TitanicBumblebird;
