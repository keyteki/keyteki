const Card = require('../../Card.js');

class EldestBear extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'gain 2 amber',
            gameAction: ability.actions.gainAmber(context => ({
                amount: (context.source.isInCenter() ? 2 : 0),
                target: context.player
            }))
        });
    }
}

EldestBear.id = 'eldest-bear';

module.exports = EldestBear;
