const Card = require('../../Card.js');

class DazedAndConfused extends Card {
    // Play: Exhaust a creature and each of its neighbors. Stun 2 exhausted creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.target ? [context.target, ...context.target.neighbors] : []
                }))
            },
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    cardCondition: (card) => card.exhausted,
                    mode: 'exactly',
                    numCards: 2,
                    gameAction: ability.actions.stun()
                }
            }
        });
    }
}

DazedAndConfused.id = 'dazed-and-confused';

module.exports = DazedAndConfused;
