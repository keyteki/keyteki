const Card = require('../../Card.js');

class Bastionclaw extends Card {
    // Your keys cost –1A for each forged key your opponent has.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'self',
            effect: ability.effects.modifyKeyCost(() =>
                this.controller.opponent ? -this.controller.opponent.getForgedKeys() : 0
            )
        });
    }
}

Bastionclaw.id = 'bastionclaw';

module.exports = Bastionclaw;
