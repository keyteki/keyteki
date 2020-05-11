const Card = require('../../Card.js');

class Kangaphant extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: () => true,
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.destroy()
            })
        });
    }
}

Kangaphant.id = 'kangaphant';

module.exports = Kangaphant;
