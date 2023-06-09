const Card = require('../../Card.js');

class Exile extends Card {
    // Play: Give control of a friendly creature to your opponent.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            },
            effect: 'give control of {0} to {1}',
            effectArgs: (context) => context.player.opponent
        });
    }
}

Exile.id = 'exile';

module.exports = Exile;
