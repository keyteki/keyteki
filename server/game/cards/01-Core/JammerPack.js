const Card = require('../../Card.js');

class JammerPack extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(2)
            })
        });
    }
}

JammerPack.id = 'jammer-pack'; // This is a guess at what the id might be - please check it!!!

module.exports = JammerPack;
