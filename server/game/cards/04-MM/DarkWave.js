const Card = require('../../Card.js');

class DarkWave extends Card {
    // Play: Deal 2D to each non-Mutant
    // creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to all non-Mutant creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('mutant'))
            }))
        });
    }
}

DarkWave.id = 'dark-wave';

module.exports = DarkWave;
