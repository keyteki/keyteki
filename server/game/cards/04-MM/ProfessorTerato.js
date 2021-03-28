const Card = require('../../Card.js');

class ProfessorTerato extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('mutant'),
            targetController: 'any',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.draw()
            })
        });
    }
}

ProfessorTerato.id = 'professor-terato';

module.exports = ProfessorTerato;
