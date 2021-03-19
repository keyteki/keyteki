const Card = require('../../Card.js');

class LexEvilTwin extends Card {
    //Play/Fight: If the tide is low, you may exalt a creature.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            condition: (context) => context.player.isTideLow(),
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

LexEvilTwin.id = 'lex-evil-twin';

module.exports = LexEvilTwin;
