const Card = require('../../Card.js');

class RelativityImp extends Card {
    // You cannot forge more than 2 keys each turn.
    // After you forge a key during your "forge a key" step, you may forge another key at current cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.canForgeSecondKeyDuringKeyPhase(),
                ability.effects.cannotForgeMoreThan2KeysInATurn()
            ]
        });
    }
}

RelativityImp.id = 'relativity-imp';

module.exports = RelativityImp;
