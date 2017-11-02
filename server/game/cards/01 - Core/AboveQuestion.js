const DrawCard = require('../../drawcard.js');

class AboveQuestion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeTargeted((card, context) => context && context.source.type === 'event' && context.source.controller !== this.controller)
        });
    }
}

AboveQuestion.id = 'above-question';

module.exports = AboveQuestion;
