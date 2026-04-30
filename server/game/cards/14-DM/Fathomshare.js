const Card = require('../../Card.js');

class Fathomshare extends Card {
    // Play: Capture half of your opponent's amber (rounding down),
    // distributed among any number of friendly creatures.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.amber >= 2 &&
                context.player.creaturesInPlay.length > 0,
            effect: 'capture {1} amber from {2}, distributed among friendly creatures',
            effectArgs: (context) => [
                Math.floor(context.player.opponent.amber / 2),
                context.player.opponent
            ],
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: Math.floor(context.player.opponent.amber / 2),
                action: ability.actions.capture({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self',
                        activePromptTitle: 'Choose a friendly creature to capture amber on'
                    }
                })
            }))
        });
    }
}

Fathomshare.id = 'fathomshare';

module.exports = Fathomshare;
