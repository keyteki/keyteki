const DrawCard = require('../../../drawcard.js');

class WidowsWail extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            match: (card) => card.name === 'Joffrey Baratheon',
            effect: ability.effects.addIcon('military')
        });
    }
}

WidowsWail.code = '01096';

module.exports = WidowsWail;
