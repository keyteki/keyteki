const Card = require('../../Card.js');

class Fathomshare extends Card {
    // Play: Capture half of your opponent's amber (rounding down), distributed among any number of friendly creatures.
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture {1} amber from {2}, distributed among friendly creatures',
            effectArgs: (context) => [
                Math.floor((context.player.opponent ? context.player.opponent.amber : 0) / 2),
                context.player.opponent
            ],
            gameAction: ability.actions.allocateCapture((context) => ({
                numAmber: Math.floor(
                    (context.player.opponent ? context.player.opponent.amber : 0) / 2
                ),
                controller: 'self',
                menuTitle: 'Choose a friendly creature to capture 1 amber on'
            }))
        });
    }
}

Fathomshare.id = 'fathomshare';

module.exports = Fathomshare;
