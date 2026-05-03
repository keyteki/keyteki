const Card = require('../../Card.js');

class Waspscream extends Card {
    // Entrench. Poison.
    // At the start of your turn, if Waspscream is exhausted, take control of an enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (event, context) =>
                    event.player === context.player && context.source.exhausted
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }
}

Waspscream.id = 'waspscream';

module.exports = Waspscream;
