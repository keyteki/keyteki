const Card = require('../../Card.js');

class Commune extends Card {
    setupCardAbilities(ability) {
        this.play({
            effectMsg: 'lose all their amber and gain 4 amber',
            gameAction: ability.actions.sequential([
                ability.actions.loseAmber((context) => ({
                    amount: context.player.amber,
                    target: context.player
                })),
                ability.actions.gainAmber({ amount: 4 })
            ])
        });
    }
}

Commune.id = 'commune';

module.exports = Commune;
