const Card = require('../../Card.js');

class Humble extends Card {
    // Play: Exhaust a creature. If you do, move 3 from that creature to the common supply.
    setupCardAbilities(ability) {
        this.play({
            effect: 'exhaust {0} and move 3 amber from it to common supply',
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
