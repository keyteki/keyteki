const Card = require('../../Card.js');

class ConductorJarroya extends Card {
    // After Reap: Ready each friendly Buggy artifact.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.ready((context) => ({
                target: context.player.cardsInPlay.filter(
                    (card) => card.hasTrait('buggy') && card.type === 'artifact'
                )
            }))
        });
    }
}

ConductorJarroya.id = 'conductor-jărroyă';

module.exports = ConductorJarroya;
