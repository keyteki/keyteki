const Card = require('../../Card.js');

class Infighting extends Card {
    //Play: Each creature deals damage equal to its power to its right neighbor.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.creaturesInPlay
                    .slice(1)
                    .concat(context.player.creaturesInPlay.slice(1)),
                amountForCard: (card) => card.neighbors[0].power
            }))
        });
    }
}

Infighting.id = 'infighting';

module.exports = Infighting;
