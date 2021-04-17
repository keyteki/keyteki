const Card = require('../../Card.js');

class Infighting extends Card {
    // Play: Each creature deals damage equal to its power to its right neighbor.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: (context.player.opponent
                    ? context.player.opponent.creaturesInPlay.slice(1)
                    : []
                ).concat(context.player.creaturesInPlay.slice(1)),
                damageSource: (card) => card.neighbors[0],
                amountForCard: (card) => card.neighbors[0].power
            })),
            effect: 'make each creature deal damage to its right neighbor'
        });
    }
}

Infighting.id = 'infighting';

module.exports = Infighting;
