const DrawCard = require('../../drawcard.js');

class AboveQuestion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });
    }
}

AboveQuestion.id = 'above-question';

module.exports = AboveQuestion;
