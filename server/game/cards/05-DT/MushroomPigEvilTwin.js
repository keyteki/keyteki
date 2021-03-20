const Card = require('../../Card.js');

class MushroomPigEvilTwin extends Card {
    //Play: Move all +1 power counters in play onto Mushroom Pig (?).
    //Reap: You may remove all +1 power counters from Mushroom Pig (?). For each counter removed this way deal 1D to each other creature.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removePowerCounter((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card !== context.source),
                all: true
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((thenContext) => ({
                    amount: thenContext.preThenEvents
                        .filter(
                            (event) =>
                                event.name === 'onRemoveToken' &&
                                !event.cancelled &&
                                event.amount > 0
                        )
                        .reduce((total, event) => total + event.amount, 0)
                }))
            }
        });

        this.reap({
            may: 'remove all power tokens',
            gameAction: ability.actions.removePowerCounter({ all: true }),
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.creaturesInPlay.filter((card) => card !== context.source)
                }))
            }
        });
    }
}

MushroomPigEvilTwin.id = 'mushroom-pig-evil-twin';

module.exports = MushroomPigEvilTwin;
