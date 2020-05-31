const Card = require('../../Card.js');

class CincinnatusRex extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: () =>
                    !this.controller.opponent ||
                    this.controller.opponent.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no opposing creatures',
                target: this,
                gameAction: ability.actions.destroy()
            })
        });

        this.play({
            condition: (context) => context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy({ target: this })
        });

        this.fight({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.ready((context) => ({
                    target: context.player.cardsInPlay.filter((card) => card !== this)
                }))
            }
        });
    }
}

CincinnatusRex.id = 'cincinnatus-rex';

module.exports = CincinnatusRex;
