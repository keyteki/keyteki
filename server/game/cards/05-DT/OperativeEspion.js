const Card = require('../../Card.js');

class OperativeEspion extends Card {
    //Elusive.
    //After a player raises the tide during their turn, they may use a creature they control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event) => event.player === this.game.activePlayer
            },
            target: {
                optional: true,
                controller: 'self',
                gameAction: ability.actions.use()
            }
        });
    }
}

OperativeEspion.id = 'operative-espion';

module.exports = OperativeEspion;
