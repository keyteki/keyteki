const Card = require('../../Card.js');

class VeilOfEctoplasm extends Card {
    // Play: For each Geistoid card in your discard pile, a friendly
    // creature captures 1 A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent && context.player.opponent.amber > 0,
            effect: 'capture 1 amber on a friendly creature for each Geistoid creature in your discard pile',
            gameAction: ability.actions.allocateCapture((context) => ({
                numAmber: Math.min(
                    context.player.opponent.amber,
                    context.player.discard.filter((c) => c.hasHouse('geistoid')).length
                ),
                controller: 'self',
                menuTitle: 'Choose a creature to capture 1 amber'
            }))
        });
    }
}

VeilOfEctoplasm.id = 'veil-of-ectoplasm';

module.exports = VeilOfEctoplasm;
