const Card = require('../../Card.js');

class Avarice extends Card {
    // Play: This creature captures 2 amber from its own side.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.parent,
                amount: 2,
                player: context.source.parent.controller
            }))
        });
    }
}

Avarice.id = 'avarice';

module.exports = Avarice;
