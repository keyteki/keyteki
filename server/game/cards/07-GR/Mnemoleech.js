const Card = require('../../Card.js');

class Mnemoleech extends Card {
    // After Reap: If your opponent is haunted, steal 2A. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.conditional({
                condition: (context) =>
                    !!context.player.opponent && context.player.opponent.isHaunted(),
                trueGameAction: ability.actions.steal({ amount: 2 }),
                falseGameAction: ability.actions.steal({ amount: 1 })
            })
        });
    }
}

Mnemoleech.id = 'mnemoleech';

module.exports = Mnemoleech;
