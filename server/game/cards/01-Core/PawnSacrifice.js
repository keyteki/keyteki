const Card = require('../../Card.js');

class PawnSacrifice extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to sacrifice',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sacrifice()
            },
            then: {
                message: '{0} uses {1} to deal 3 damage to {2}',
                target: {
                    cardType: 'creature',
                    mode: 'exactly',
                    numCards: 2,
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            }
        });
    }
}

PawnSacrifice.id = 'pawn-sacrifice';

module.exports = PawnSacrifice;
