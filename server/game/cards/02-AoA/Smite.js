const Card = require('../../Card.js');

class Smite extends Card {
    // Play: Ready and fight with a friendly creature. Deal 2D to the attacked creature's neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.ready()
            },
            effect: 'ready and fight with {0}, dealing 2 damage to its neighbors',
            then: (preThenContext) => {
                // Register a one-time listener to capture the fight target
                const fightListener = (event) => {
                    if (event.attacker === preThenContext.target) {
                        this.smiteTarget = event.attackerTarget;
                        preThenContext.game.removeListener('onFight', fightListener);
                    }
                };
                preThenContext.game.on('onFight', fightListener);

                return {
                    gameAction: ability.actions.fight({
                        target: preThenContext.target
                    }),
                    then: {
                        alwaysTriggers: true,
                        gameAction: ability.actions.dealDamage(() => {
                            const target = this.smiteTarget;
                            const neighbors =
                                target?.location === 'play area'
                                    ? target.neighbors
                                    : target?.neighborsBeforeLeavingPlay || [];
                            return {
                                amount: 2,
                                target: neighbors
                            };
                        })
                    }
                };
            }
        });
    }
}

Smite.id = 'smite';

module.exports = Smite;
