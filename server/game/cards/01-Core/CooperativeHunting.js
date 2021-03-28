const Card = require('../../Card.js');

class CooperativeHunting extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to a creature for each creature they control',
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps: context.player.creaturesInPlay.length
            }))
        });
    }
}

CooperativeHunting.id = 'cooperative-hunting';

module.exports = CooperativeHunting;
