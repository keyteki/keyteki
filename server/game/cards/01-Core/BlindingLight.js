const Card = require('../../Card.js');

class BlindingLight extends Card {
    // Play: Choose a house. Stun each creature of that house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
            }))
        });
    }
}

BlindingLight.id = 'blinding-light';

module.exports = BlindingLight;
