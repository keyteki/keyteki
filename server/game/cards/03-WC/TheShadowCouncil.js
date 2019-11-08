const Card = require('../../Card.js');

class TheShadowCouncil extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isInCenter(),
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.steal({ amount: 2 })
            })
        });
    }
}

TheShadowCouncil.id = 'the-shadow-council';

module.exports = TheShadowCouncil;
