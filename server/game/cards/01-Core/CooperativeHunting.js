const Card = require('../../Card.js');

class CooperativeHunting extends Card {
    // Play: Deal 1<D> for each friendly creature in play. You may divide this damage among any number of creatures.
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
