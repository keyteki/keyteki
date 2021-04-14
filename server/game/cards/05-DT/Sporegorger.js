const Card = require('../../Card.js');

class Sporegorger extends Card {
    //Reap: Give this creature a +1 power counter. You may remove all +1 power counters from this creature. If you do, deal 1D to each other creature for each +1 power counter removed this way.
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

module.exports = Sporegorger;
