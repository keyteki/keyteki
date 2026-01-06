const Card = require('../../Card.js');

class TheEvilInTheRanks extends Card {
    // Play: Each enemy flank creature deals damage to its neighbor equal to its power.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make each enemy flank creature deal damage to its neighbor equal to its power',
            then: (context) => {
                if (!context.player.opponent) {
                    return { alwaysTriggers: true, gameAction: [] };
                }

                let enemyCreatures = context.player.opponent.creaturesInPlay;
                let actions = [];

                for (let creature of enemyCreatures) {
                    if (creature.isOnFlank()) {
                        for (let neighbor of creature.neighbors) {
                            actions.push(
                                ability.actions.dealDamage({
                                    target: neighbor,
                                    damageSource: creature,
                                    amount: creature.power
                                })
                            );
                        }
                    }
                }

                return {
                    alwaysTriggers: true,
                    gameAction: actions
                };
            }
        });
    }
}

TheEvilInTheRanks.id = 'the-evil-in-the-ranks';

module.exports = TheEvilInTheRanks;
