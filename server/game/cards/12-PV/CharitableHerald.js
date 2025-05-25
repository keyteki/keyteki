const Card = require('../../Card.js');

class CharitableHerald extends Card {
    // Play/After Reap: Ward a creature.
    // Fate: Remove each ward from each friendly creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.ward()
            }
        });

        this.fate({
            gameAction: ability.actions.removeWard((context) => ({
                target: context.game.activePlayer.creaturesInPlay
            }))
        });
    }
}

CharitableHerald.id = 'charitable-herald';

module.exports = CharitableHerald;
