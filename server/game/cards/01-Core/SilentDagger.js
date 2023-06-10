const Card = require('../../Card.js');

class SilentDagger extends Card {
    // This creature gains, Reap: Deal 4<D> to a flank creature.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: ability.actions.dealDamage({ amount: 4 })
                }
            })
        });
    }
}

SilentDagger.id = 'silent-dagger';

module.exports = SilentDagger;
