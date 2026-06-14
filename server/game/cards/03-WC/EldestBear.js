const Card = require('../../Card.js');

class EldestBear extends Card {
    // Assault 3.
    // While Eldest Bear is in the center of your battleline, it gains, "Before Fight: Gain 2."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            effect: ability.effects.gainAbility('beforeFight', {
                effect: 'gain 2 amber',
                gameAction: ability.actions.gainAmber({ amount: 2 })
            })
        });
    }
}

EldestBear.id = 'eldest-bear';

module.exports = EldestBear;
