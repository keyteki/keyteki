const Card = require('../../Card.js');

class TyrannusAquilae extends Card {
    // At the end of each player’s turn, Tyrannus Aquilae captures 1A.
    // After Fight: Move 1A from Tyrannus Aquilae to your pool.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: () => true
            },
            gameAction: ability.actions.capture()
        });

        this.fight({
            condition: (context) => context.source.amber > 0,
            effect: 'move 1 amber from {0} to their pool',
            gameAction: ability.actions.removeAmber(),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

TyrannusAquilae.id = 'tyrannus-aquilae';

module.exports = TyrannusAquilae;
