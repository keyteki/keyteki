const Card = require('../../Card.js');

class GezrahiBlacksmith extends Card {
    // At the start of each player's turn, that player chooses to
    // either make a token creature or draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: () => true
            },
            useEventPlayer: true,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Make a token creature': ability.actions.makeTokenCreature(),
                        'Draw a card': ability.actions.draw()
                    }
                }
            }
        });
    }
}

GezrahiBlacksmith.id = 'gezrăhi-blacksmith';

module.exports = GezrahiBlacksmith;
