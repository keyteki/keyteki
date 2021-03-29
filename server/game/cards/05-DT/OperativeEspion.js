const Card = require('../../Card.js');

class OperativeEspion extends Card {
    //Elusive.
    //After a player raises the tide during their turn, they may use a creature they control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event) => event.player === this.game.activePlayer
            },
            optional: true,
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card.controller === context.event.player,
                gameAction: ability.actions.use()
            }
        });
    }
}

OperativeEspion.id = 'operative-espion';

module.exports = OperativeEspion;
