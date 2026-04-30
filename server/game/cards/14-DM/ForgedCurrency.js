const Card = require('../../Card.js');

class ForgedCurrency extends Card {
    // Play: Move each +1 power counter and each A from friendly creatures
    // to the common supply. Forge a key at +6 current cost, reduced by 1
    // for the total number of +1 power counters and A moved to the common
    // supply this way (to a minimum of 6).
    setupCardAbilities(ability) {
        this.play({
            effect: 'move all +1 power counters and amber from friendly creatures to the common supply',
            gameAction: ability.actions.jointAction([
                ability.actions.removePowerCounter((context) => ({
                    target: context.player.creaturesInPlay.filter((c) => c.hasToken('power')),
                    all: true
                })),
                ability.actions.removeAmber((context) => ({
                    target: context.player.creaturesInPlay.filter((c) => c.hasToken('amber')),
                    all: true
                }))
            ]),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.forgeKey((preThenContext) => ({
                    modifier: Math.max(
                        0,
                        6 -
                            (preThenContext.preThenEvents || []).reduce(
                                (sum, event) => sum + (event.cancelled ? 0 : event.amount || 0),
                                0
                            )
                    )
                }))
            }
        });
    }
}

ForgedCurrency.id = 'forged-currency';

module.exports = ForgedCurrency;
