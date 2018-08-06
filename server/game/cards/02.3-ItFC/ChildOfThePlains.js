const DrawCard = require('../../drawcard.js');

class ChildOfThePlains extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Get first action',
            when: {
                onProvinceRevealed: (event, context) => context.source.isAttacking()
            },
            effect: 'get the first action in this conflict',
            gameAction: ability.actions.playerLastingEffect({
                effect:ability.effects.gainActionPhasePriority()
            })
        });
    }
}

ChildOfThePlains.id = 'child-of-the-plains'; // This is a guess at what the id might be - please check it!!!

module.exports = ChildOfThePlains;
