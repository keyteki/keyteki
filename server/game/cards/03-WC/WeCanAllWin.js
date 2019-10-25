const Card = require('../../Card.js');

class WeCanAllWin extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'reduce key cost by 2 until the end of their next turn',
            gameAction: ability.actions.untilEndOfMyNextTurn({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(-2)
            })
        });
    }
}

WeCanAllWin.id = 'we-can-all-win';

module.exports = WeCanAllWin;
