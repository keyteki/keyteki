const Card = require('../../Card.js');

class SkeletalMurmook extends Card {
    // While you are haunted, your opponent's keys cost +2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

SkeletalMurmook.id = 'skeletal-murmook';

module.exports = SkeletalMurmook;
