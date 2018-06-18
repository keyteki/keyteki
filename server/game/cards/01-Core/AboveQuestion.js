const DrawCard = require('../../drawcard.js');

class AboveQuestion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('target', context => context && context.source.type === 'event' && context.source.controller === this.controller.opponent)
        });
    }
}

AboveQuestion.id = 'above-question';

module.exports = AboveQuestion;
