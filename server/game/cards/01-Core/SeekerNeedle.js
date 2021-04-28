const Card = require('../../Card.js');

class SeekerNeedle extends Card {
    setupCardAbilities(ability) {
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

SeekerNeedle.id = 'seeker-needle';

module.exports = SeekerNeedle;
