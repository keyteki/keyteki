const Card = require('../../Card.js');

class SpherularGem extends Card {
    // Action: Destroy Spherular Gem. If you do, gain X equal to the number of forged keys.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.destroy((context) => ({ target: context.source })),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.game
                        .getPlayers()
                        .reduce((total, player) => total + player.getForgedKeys(), 0)
                }))
            },
            effect: 'destroy {0}, gaining amber equal to the number of forged keys'
        });
    }
}

SpherularGem.id = 'spherular-gem';

module.exports = SpherularGem;
