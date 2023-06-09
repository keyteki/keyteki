const Card = require('../../Card.js');

class SeekerNeedle extends Card {
    // Action: Deal 1<D> to a creature. If this damage destroys that creature, gain 1<A>.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage()
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                message: '{0} uses {1} to gain 1 amber',
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

SeekerNeedle.id = 'seeker-needle';

module.exports = SeekerNeedle;
