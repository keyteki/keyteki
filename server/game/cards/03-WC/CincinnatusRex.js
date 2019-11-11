const Card = require('../../Card.js');

class CincinnatusRex extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy({ target: this })
        });

        this.fight({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.ready(context => ({
                    target: context.player.cardsInPlay.filter(card => card !== this)
                }))
            }
        });

        this.reaction({
            when: {
                onCardLeavesPlay: (event, context) => event.card.type === 'creature' && context.player.opponent &&
                    context.player.opponent.creaturesInPlay.length === 0
            },
            gameAction: ability.actions.destroy({ target: this })
        });
    }
}

CincinnatusRex.id = 'cincinnatus-rex';

module.exports = CincinnatusRex;
