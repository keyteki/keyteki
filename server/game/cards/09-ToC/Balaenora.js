const Card = require('../../Card.js');

class Balaenora extends Card {
    // Balaenora cannot be played unless your opponent has 7A or more
    // in their pool.
    // Play: Capture all of your opponent's A.
    // After Fight: Give control of Balaenora to your opponent.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot(
                'play',
                (context) => !context.player.opponent || context.player.opponent.amber < 7
            )
        });

        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber
            }))
        });

        this.fight({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.source,
                duration: 'lastingEffect',
                effect: ability.effects.takeControl(context.source.controller.opponent)
            })),
            effect: 'give control of {0} to {1}',
            effectArgs: (context) => [context.player.opponent]
        });
    }
}

Balaenora.id = 'balaenora';

module.exports = Balaenora;
