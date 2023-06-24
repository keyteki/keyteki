const Card = require('../../Card.js');

class CloakingDongle extends Card {
    // This creature and each of its neighbors gains elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ elusive: 1 }),
                ability.effects.gainAbility('persistentEffect', {
                    match: (card, context) => context.source.neighbors.includes(card),
                    effect: ability.effects.addKeyword({ elusive: 1 })
                })
            ]
        });
    }
}

CloakingDongle.id = 'cloaking-dongle';

module.exports = CloakingDongle;
