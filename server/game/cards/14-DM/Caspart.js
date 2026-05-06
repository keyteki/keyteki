const Card = require('../../Card.js');

class Caspart extends Card {
    // Entrench.
    // At the end of your turn, if Caspart is exhausted, exhaust 2 other creatures.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (event, context) =>
                    context.player === this.game.activePlayer && context.source.exhausted
            },
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'any',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.exhaust()
            },
            effect: 'exhaust {0}'
        });
    }
}

Caspart.id = 'caspart';

module.exports = Caspart;
