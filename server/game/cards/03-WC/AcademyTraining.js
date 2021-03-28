const Card = require('../../Card.js');

class AcademyTraining extends Card {
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
