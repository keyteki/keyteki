const Card = require('../../Card.js');

class Valoocanth extends Card {
    //  While the tide is low, Valoocanth cannot be used.
    // Fight/Reap: Exhaust an enemy creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideLow(),
            effect: ability.effects.cardCannot('use')
        });
        this.fight({
            reap: true,
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.target ? context.target.neighbors.concat(context.target) : []
                }))
            }
        });
    }
}

Valoocanth.id = 'valoocanth';

module.exports = Valoocanth;
