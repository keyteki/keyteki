const Card = require('../../Card.js');

class BonerotVenom extends Card {
    // After this creature is used, deal 2D to it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.source.parent
            }))
        });
    }
}

BonerotVenom.id = 'bonerot-venom';

module.exports = BonerotVenom;
