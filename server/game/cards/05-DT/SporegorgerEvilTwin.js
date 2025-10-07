import Card from '../../Card.js';

class SporegorgerEvilTwin extends Card {
    // Play: Move each +1 power counter in play to Sporegorger.
    // Reap: You may remove each +1 power counter from Sporegorger. For each counter removed this way, deal 1D to each other creature.
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
                        .filter((event) => !event.cancelled && event.amount > 0)
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

SporegorgerEvilTwin.id = 'sporegorger-evil-twin';

export default SporegorgerEvilTwin;
