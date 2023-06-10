const Card = require('../../Card.js');

class AcademyTraining extends Card {
    // If you control this creature, it belongs to house Logos. (Instead of its original house.)
    // This creature gains, Reap: Draw a card.
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => this.owner === card.controller,
            effect: ability.effects.changeHouse('logos')
        });
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.draw()
            })
        });
    }
}

AcademyTraining.id = 'academy-training';

module.exports = AcademyTraining;
