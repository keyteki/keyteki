const Card = require('../../Card.js');

class Sniffer extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'make each creature lose elusive',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                target: context.game.getPlayers(),
                effect: ability.effects.removeTrait('elusive')
            }))
        });
    }
}

Sniffer.id = 'sniffer'; // This is a guess at what the id might be - please check it!!!

module.exports = Sniffer;
