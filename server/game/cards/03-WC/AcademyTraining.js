const Card = require('../../Card.js');

class AcademyTraining extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.changeHouse('logos'),
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.draw()
                })
            ]
        });
    }
}

AcademyTraining.id = 'academy-training';

module.exports = AcademyTraining;
