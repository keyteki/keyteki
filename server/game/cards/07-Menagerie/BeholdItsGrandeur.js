const Card = require('../../Card.js');

class BeholdItsGrandeur extends Card {
    // Play: Gain 1 for each creature you control that shares a house with one or more of its neighbors, to a maximum of 4.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => {
                let count = context.player.creaturesInPlay.filter((card) => {
                    let neighbors = card.neighbors;
                    return neighbors.some((neighbor) => card.hasHouse(neighbor.printedHouse));
                }).length;
                return { amount: Math.min(count, 4) };
            })
        });
    }
}

BeholdItsGrandeur.id = 'behold-its-grandeur';

module.exports = BeholdItsGrandeur;
