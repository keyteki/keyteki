const Card = require('../../Card.js');

class LeftInItsWake extends Card {
    // Play: Choose a house. Exhaust each creature that belongs to that house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
            }))
        });
    }
}

LeftInItsWake.id = 'left-in-its-wake';

module.exports = LeftInItsWake;
