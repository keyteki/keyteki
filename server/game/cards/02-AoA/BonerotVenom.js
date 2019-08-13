const Card = require('../../Card.js');

class BonerotVenom extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onUseCard: event => event.card === this.parent
                },
                gameAction: ability.actions.dealDamage({ amount: 2 })
            })
        });
    }
}

BonerotVenom.id = 'bonerot-venom';

module.exports = BonerotVenom;
