const Card = require('../../Card.js');

class Raider extends Card {
    // Raider gains poison during your turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.cardLastingEffect({
                duration: 'untilEndOfRound',
                effect: [ability.effects.addKeyword({ poison: 1 })]
            })
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card.type === 'creature'
            },
            gameAction: ability.actions.cardLastingEffect({
                duration: 'untilEndOfRound',
                effect: [ability.effects.addKeyword({ poison: 1 })]
            })
        });
    }
}

Raider.id = 'raider';

module.exports = Raider;
