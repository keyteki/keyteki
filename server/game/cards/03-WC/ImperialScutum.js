const Card = require('../../Card.js');

class ImperialScutum extends Card {
    // This creature gets +2 armor and gains, Destroyed: Move each A on this creature to the common supply.
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
