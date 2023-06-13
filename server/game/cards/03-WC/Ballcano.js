const Card = require('../../Card.js');

class Ballcano extends Card {
    // Play: Deal 4D to each creature. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 4 damage to all creatures, gaining 2 chains',
            gameAction: [
                ability.actions.dealDamage((context) => ({
                    amount: 4,
                    target: context.game.creaturesInPlay
                })),
                ability.actions.gainChains({ amount: 2 })
            ]
        });
    }
}

Ballcano.id = 'ballcano';

module.exports = Ballcano;
