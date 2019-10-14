const Card = require('../../Card.js');

class ImperialScutum extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyArmor(2),
                ability.effects.gainAbility('destroyed', {
                    gameAction: ability.actions.removeAmber({ all: true })
                })
            ]
        });
    }
}

ImperialScutum.id = 'imperial-scutum';

module.exports = ImperialScutum;
