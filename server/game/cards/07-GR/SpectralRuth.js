const Card = require('../../Card.js');

class SpectralRuth extends Card {
    // Play: If you forged a key this turn, archive your discard pile.
    //
    // Destroyed: If you are haunted, archive Spectral Ruth.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.keysForgedThisRound.length > 0,
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard
            }))
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

SpectralRuth.id = 'spectral-ruth';

module.exports = SpectralRuth;
