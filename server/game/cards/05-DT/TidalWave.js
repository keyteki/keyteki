const Card = require('../../Card.js');

class TidalWave extends Card {
    //Play: If the tide is high, destroy a creature and each of its neighbors. Your opponent raises the tide.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.player.isTideHigh(),
                gameAction: ability.actions.destroy((context) => ({
                    target: context.target ? context.target.neighbors.concat(context.target) : []
                }))
            },
            gameAction: ability.actions.raiseTide((context) => ({
                target: context.player.opponent
            }))
        });
    }
}

TidalWave.id = 'tidal-wave';

module.exports = TidalWave;
