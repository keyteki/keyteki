const DrawCard = require('../../../drawcard.js');

class WidowsWail extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.modifyStrength(2)
        });
        this.whileAttached({
            match: (card) => card.name === 'Joffrey Baratheon',
            effect: dsl.effects.addIcon('military')
        });
    }
}

WidowsWail.code = '01096';

module.exports = WidowsWail;
