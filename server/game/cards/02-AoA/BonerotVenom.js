const Card = require('../../Card.js');

class BonerotVenom extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('constant', {
                when: {
                    onReap: event => event.card === this.parent,
                    onFight: event => event.card === this.parent,
                    onAction: event => event.card === this.parent,
                },
                gameAction: ability.actions.dealDamage({ amount: 2 })
            })
        });
    }
}

BonerotVenom.id = 'bonerot-venom';

module.exports = BonerotVenom;
