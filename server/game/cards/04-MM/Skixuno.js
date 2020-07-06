const Card = require('../../Card.js');

class Skixuno extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each other creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card !== context.source)
            })),
            then: (context) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((thenContext) => ({
                    amount: thenContext.preThenEvents.filter(
                        (event) =>
                            event.name === 'onCardDestroyed' &&
                            !event.cancelled &&
                            event.context === context
                    ).length
                }))
            })
        });
    }
}

Skixuno.id = 'skixuno';

module.exports = Skixuno;
