import Card from '../../Card.js';

class Sporegorger extends Card {
    // Reap: Give Sporegorger a +1 power counter. You may remove each +1 power counter from Sporegorger. For each counter removed this way, deal 1D to each other creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.addPowerCounter((context) => {
                context.source;
            }),
            then: {
                may: 'remove all power tokens',
                alwaysTriggers: true,
                gameAction: ability.actions.removePowerCounter({ all: true }),
                then: {
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.preThenEvent.amount,
                        target: context.game.creaturesInPlay.filter(
                            (card) => card !== context.source
                        )
                    }))
                }
            }
        });
    }
}

Sporegorger.id = 'sporegorger';

export default Sporegorger;
