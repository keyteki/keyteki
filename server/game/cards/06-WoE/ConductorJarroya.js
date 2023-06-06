const Card = require('../../Card.js');

class ConductorJarroya extends Card {
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
