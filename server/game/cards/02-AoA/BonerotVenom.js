const Card = require('../../Card.js');

class BonerotVenom extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('constant', {
                when: {
                    onCardExhausted: event => (event.card === this.parent)
                },
                gameAction: ability.actions.dealDamage({ amount: 2 })
            })
        });
    }
}

BonerotVenom.id = 'bonerot-venom';

module.exports = BonerotVenom;
