const Card = require('../../Card.js');

class Lex extends Card {
    //Play/Fight: If the tide is high, you may exalt a creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            condition: (context) => context.player.isTideHigh(),
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

Lex.id = 'lex';

module.exports = Lex;
