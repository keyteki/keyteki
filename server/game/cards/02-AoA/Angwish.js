const Card = require('../../Card.js');

class Angwish extends Card {
    // For each damage on Angwish,
    // your opponents keys cost +1A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player, context) => context.source.tokens.damage || 0
            )
        });
    }
}

Angwish.id = 'angwish';

module.exports = Angwish;
