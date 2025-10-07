import Card from '../../Card.js';

class RedeemTheCrucible extends Card {
    // Omega.
    // Play: Destroy each creature. You may forge a key at +6A current cost, reduced by 1A for each Mutant creature destroyed this way. Purge Redeem the Crucible.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                // Annoying and wrong that we have to purge before the key is forged, but if the user
                // doesn't forge a key, it won't go on to the following `then` ability so for now
                // just do it first.
                gameAction: ability.actions.purge(),
                then: (preThenContext) => ({
                    alwaysTriggers: true,
                    may: 'forge a key',
                    gameAction: ability.actions.forgeKey({
                        modifier:
                            6 -
                            preThenContext.preThenEvents.filter(
                                (event) => !event.cancelled && event.clone.hasTrait('mutant')
                            ).length
                    })
                })
            }
        });
    }
}

RedeemTheCrucible.id = 'redeem-the-crucible';

export default RedeemTheCrucible;
