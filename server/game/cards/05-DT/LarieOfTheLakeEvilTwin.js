const Card = require('../../Card.js');

class LarieOfTheLakeEvilTwin extends Card {
    //While the tide is high, $this gets +5 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.modifyArmor(5)
        });
    }
}

LarieOfTheLakeEvilTwin.id = 'lærie-of-the-lake-evil-twin';

module.exports = LarieOfTheLakeEvilTwin;
