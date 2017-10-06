const DrawCard = require('../../drawcard.js');

class AboveQuestion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeTargeted((card, context) => context.card.type === 'event' && context.card.controller !== this.controller)
        });
    }
}

AboveQuestion.id = 'above-question';

module.exports = AboveQuestion;
