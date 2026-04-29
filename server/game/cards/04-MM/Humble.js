const Card = require('../../Card.js');

class Humble extends Card {
    // Play: Exhaust a creature. If you do, move 3 from that creature to the common supply.
    setupCardAbilities(ability) {
        this.play({
            effect: 'to exhaust {0} and move {1} amber from {0} to common supply',
            effectArgs: (context) => [context.target.amber],
            target: {
                controller: 'any',
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.removeAmber({
                    amount: 3,
                    target: preThenContext.target
                })
            })
        });
    }
}

Humble.id = 'humble';

module.exports = Humble;
