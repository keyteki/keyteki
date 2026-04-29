const Card = require('../../Card.js');

class PhantasmCloak extends Card {
    // This creature gains, "After Reap: If you are haunted, gain 2."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                condition: (context) => context.player.isHaunted(),
                gameAction: ability.actions.gainAmber({ amount: 2 })
            })
        });
    }
}

PhantasmCloak.id = 'phantasm-cloak';

module.exports = PhantasmCloak;
