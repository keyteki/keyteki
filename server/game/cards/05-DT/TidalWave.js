const Card = require('../../Card.js');

class TidalWave extends Card {
    //Play: If the tide is high, destroy a creature and each of its neighbors. Your opponent raises the tide.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                condition: (context) => context.player.isTideHigh(),
                gameAction: ability.actions.destroy((context) => ({
                    target: context.target.neighbors.concat(context.target)
                }))
            },
            gameAction: ability.actions.raiseTide()
        });
    }
}

TidalWave.id = 'tidal-wave';

module.exports = TidalWave;
