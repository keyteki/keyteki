const Card = require('../../Card.js');

class AviatrixVirtuosa extends Card {
    // Deploy.
    // Play: Exhaust each non-flank creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.isOnFlank())
            }))
        });
    }
}

AviatrixVirtuosa.id = 'aviatrix-virtuosa';

module.exports = AviatrixVirtuosa;
