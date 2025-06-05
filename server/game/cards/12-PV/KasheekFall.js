const Card = require('../../Card.js');

class KasheekFall extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((creature) => {
                    const neighbors = creature.neighbors;
                    return neighbors.some((neighbor) => neighbor.power > creature.power);
                })
            }))
        });

        this.fate({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((creature) => {
                    const neighbors = creature.neighbors;
                    return neighbors.some((neighbor) => neighbor.power < creature.power);
                })
            }))
        });
    }
}

KasheekFall.id = 'kasheek-fall';

module.exports = KasheekFall;
