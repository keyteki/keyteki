const Card = require('../../Card.js');

class DrayConis extends Card {
    // Entrench.
    // At the start of your turn, if Dray Conis is exhausted, destroy each creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) =>
                    context.player === this.game.activePlayer && context.source.exhausted
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            effect: 'destroy each creature'
        });
    }
}

DrayConis.id = 'dray-conis';

module.exports = DrayConis;
