const Card = require('../../Card.js');

class ZavelArchaeologist extends Card {
    // Each time you play an artifact from your discard pile, gain 1.
    //
    // Play/After Reap: You may play an artifact from your discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'artifact' &&
                    event.player === context.player &&
                    event.originalLocation === 'discard'
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.player
            }))
        });

        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'artifact',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

ZavelArchaeologist.id = 'zavel-archaeologist';

module.exports = ZavelArchaeologist;
