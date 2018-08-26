const Card = require('../../Card.js');

class SilentDagger extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    cardCondition: card => card.isOnFlank(),
                    gameAction: ability.actions.dealDamage({ amount: 4 })
                }
            })
        });
    }
}

SilentDagger.id = 'silent-dagger'; // This is a guess at what the id might be - please check it!!!

module.exports = SilentDagger;
