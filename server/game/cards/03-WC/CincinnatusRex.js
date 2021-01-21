const Card = require('../../Card.js');

class CincinnatusRex extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) =>
                    !context.player.opponent ||
                    context.player.opponent.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no opposing creatures',
                gameAction: ability.actions.destroy()
            })
        });

        this.play({
            condition: (context) => context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy((context) => ({ target: context.source }))
        });

        this.fight({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.ready((context) => ({
                    target: context.player.cardsInPlay.filter((card) => card !== context.source)
                }))
            }
        });
    }
}

CincinnatusRex.id = 'cincinnatus-rex';

module.exports = CincinnatusRex;
