const Card = require('../../Card.js');

class KillzordMk9001 extends Card {
    // This creature gets +2armor and +2power.
    // This creature gains skirmish and, Fight: Gain 1chain.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.modifyArmor(2),
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainChains({ amount: 1 })
                })
            ]
        });
    }
}

KillzordMk9001.id = 'killzord-mk-9001';

module.exports = KillzordMk9001;
