const Card = require('../../Card.js');

class SoftLanding extends Card {
    // Play: The next creature or artifact you play this turn enters play ready.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make the next creature/artifact played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        (event.card.type === 'creature' || event.card.type === 'artifact') &&
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

SoftLanding.id = 'soft-landing';

module.exports = SoftLanding;
