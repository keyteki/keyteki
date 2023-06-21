const Card = require('../../Card.js');

class IronyxRebel extends Card {
    // Play: Ready each of Ironyx Rebel's Mars neighbors.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ready((context) => ({
                target: context.source.neighbors.filter((card) => card.hasHouse('mars'))
            }))
        });
    }
}

IronyxRebel.id = 'ironyx-rebel';

module.exports = IronyxRebel;
