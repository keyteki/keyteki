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

PawnSacrifice.id = 'pawn-sacrifice'; // This is a guess at what the id might be - please check it!!!

module.exports = PawnSacrifice;
