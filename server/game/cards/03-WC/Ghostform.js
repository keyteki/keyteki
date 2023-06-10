const Card = require('../../Card.js');

class Ghostform extends Card {
    // This creature gains invulnerable. (It cannot be destroyed or dealt damage.)
    // This creature gains, Fight/Reap: Archive Ghostform.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ invulnerable: 1 }),
                ability.effects.gainAbility('fight', {
                    reap: true,
                    gameAction: ability.actions.archive({ target: this })
                })
            ]
        });
    }
}

Ghostform.id = 'ghostform';

module.exports = Ghostform;
