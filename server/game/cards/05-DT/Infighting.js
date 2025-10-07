import Card from '../../Card.js';

class Infighting extends Card {
    // Play: Each creature deals damage equal to its power to its right neighbor.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make each creature deal damage to its right neighbor equal to its power',
            then: (context) => {
                let actions = context.player.creaturesInPlay.slice(1).map((creature) =>
                    ability.actions.dealDamage({
                        target: creature,
                        damageSource: creature.neighbors[0],
                        amount: creature.neighbors[0].power
                    })
                );

                if (context.player.opponent) {
                    actions = actions.concat(
                        context.player.opponent.creaturesInPlay.slice(1).map((creature) =>
                            ability.actions.dealDamage({
                                target: creature,
                                damageSource: creature.neighbors[0],
                                amount: creature.neighbors[0].power
                            })
                        )
                    );
                }

                return {
                    alwaysTriggers: true,
                    gameAction: actions
                };
            }
        });
    }
}

Infighting.id = 'infighting';

export default Infighting;
