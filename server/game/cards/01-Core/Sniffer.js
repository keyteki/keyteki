const Card = require('../../Card.js');

class Sniffer extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'make each creature lose elusive',
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'any',
                effect: ability.effects.removeKeyword('elusive')
            })
        });
    }
}

Sniffer.id = 'sniffer';

module.exports = Sniffer;
