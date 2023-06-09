const Card = require('../../Card.js');

class EldestBear extends Card {
    // Assault 3.
    // While Eldest Bear is in the center of your battleline, it gains, "Before Fight: Gain 2."
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: 'gain 2 amber',
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.isInCenter() ? 2 : 0,
                target: context.player
            }))
        });
    }
}

EldestBear.id = 'eldest-bear';

module.exports = EldestBear;
