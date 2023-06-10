const Card = require('../../Card.js');

class Commune extends Card {
    // Omega. (After you play this card, end this step.)
    // Play: Lose all of your A. Gain 4A.
    setupCardAbilities(ability) {
        this.play({
            message: '{0} uses {1} to lose all their amber and gain 4 amber',
            messageArgs: (context) => [context.player, context.source],
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
