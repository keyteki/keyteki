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
            }),
            message: '{0} uses {1} to steal {2} amber',
            messageArgs: (context) => [
                context.player,
                context.source,
                !!context.player.opponent && context.player.opponent.isHaunted()
                    ? Math.min(2, context.player.opponent.amber ?? 0)
                    : Math.min(1, context.player.opponent.amber ?? 0)
            ]
        });
    }
}

Mnemoleech.id = 'mnemoleech';

module.exports = Mnemoleech;
