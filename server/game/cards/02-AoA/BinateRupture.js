const Card = require('../../Card.js');

class BinateRupture extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Play: Each player gains A equal to
    // the A in their pool.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make both players gain amber equal to the amber in their pool',
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent,
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player,
                    amount: context.player.amber
                }))
            ]
        });
    }
}

BinateRupture.id = 'binate-rupture';

module.exports = BinateRupture;
