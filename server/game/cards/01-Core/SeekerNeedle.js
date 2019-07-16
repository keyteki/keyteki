const Card = require('../../Card.js');

class SeekerNeedle extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                condition: context => context.preThenEvent.destroyed,
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

SeekerNeedle.id = 'seeker-needle';

module.exports = SeekerNeedle;
