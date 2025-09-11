const Card = require('../../Card.js');

class Tangimangi extends Card {
    // While your opponent is haunted, their keys cost +3.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.isHaunted(),
            effect: ability.effects.modifyKeyCost(3)
        });
    }
}

Tangimangi.id = 'tangimangi';

module.exports = Tangimangi;
