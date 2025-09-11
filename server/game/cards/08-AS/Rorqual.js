const Card = require('../../Card.js');

class Rorqual extends Card {
    // Rorqual gets +1 power for each A on it.
    // After Fight/After Reap: Exalt Rorqual.
    // Action: Move all A from Rorqual to your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.amber)
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.exalt()
        });

        this.action({
            condition: (context) => context.source.amber > 0,
            effect: 'move {1} amber from {0} to their pool',
            effectArgs: (context) => [context.source.amber],
            gameAction: ability.actions.removeAmber({ all: true }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount
                }))
            }
        });
    }
}

Rorqual.id = 'rorqual';

module.exports = Rorqual;
