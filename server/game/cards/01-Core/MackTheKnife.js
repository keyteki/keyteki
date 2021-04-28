const Card = require('../../Card.js');

class MackTheKnife extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse((card) => card === this)
        });

        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage()
            },
            then: (context) => ({
                condition: () => context.target.location !== 'play area',
                message: '{0} uses {1} to gain 1 amber',
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

MackTheKnife.id = 'mack-the-knife';

module.exports = MackTheKnife;
