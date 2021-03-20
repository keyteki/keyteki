const Card = require('../../Card.js');

class Infighting extends Card {
    //Play: Each creature deals damage equal to its power to its right neighbor.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                // iterate over all creatures in the game, each creature takes damage from the creature on its left.
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        card.type === 'creature' &&
                        card.neighbors.length > 0 &&
                        card.controller.creaturesInPlay.indexOf(card.neighbors[0]) <
                            card.controller.creaturesInPlay.indexOf(card) // the neighbor is on the left
                ),
                amountForCard: (card) => card.neighbors[0].power
            }))
        });
    }
}

Infighting.id = 'infighting';

module.exports = Infighting;
