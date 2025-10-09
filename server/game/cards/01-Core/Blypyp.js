const Card = require('../../Card.js');

class Blypyp extends Card {
    // Reap: The next Mars creature you play this turn enters play ready.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'make the next Mars creature played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.card.type === 'creature' &&
                        event.card.hasHouse('mars') &&
                        context.player === event.player
                },
                multipleTrigger: false,
                triggeredAbilityType: 'interrupt',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    target: context.event.card,
                    targetLocation: 'any',
                    effect: ability.effects.entersPlayReady()
                }))
            }))
        });
    }
}

Blypyp.id = 'blypyp';

module.exports = Blypyp;
