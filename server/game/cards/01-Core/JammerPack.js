const Card = require('../../Card.js');

class JammerPack extends Card {
    // This creature gains, Your opponent's keys cost +2<A>.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(2)
            })
        });
    }
}

JammerPack.id = 'jammer-pack';

module.exports = JammerPack;
