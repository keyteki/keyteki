import Card from '../../Card.js';

class KasheekFall extends Card {
    // Play: Destroy each creature with a more powerful neighbor.
    // Fate: Destroy each creature with a less powerful neighbor.
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

export default KasheekFall;
