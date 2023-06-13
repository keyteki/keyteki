const Card = require('../../Card.js');

class FissionBloom extends Card {
    // Enhance R. (These icons have already been added to cards in your deck.)
    // Action: The next time you play a card this turn, resolve each of its bonus icons an additional time.
    setupCardAbilities(ability) {
        this.action({
            effect: 'resolve the bonus icons of the next card played an additional time',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                message: '{0} uses {1} to resolve the bonus icons of {2} an additional time',
                messageArgs: (context) => [context.player, context.source, context.event.card],
                multipleTrigger: false,
                triggeredAbilityType: 'interrupt',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    until: {
                        onResolveBonusIcons: () => true
                    },
                    target: context.event.card,
                    targetLocation: 'any',
                    effect: ability.effects.resolveBonusIconsAdditionalTime()
                }))
            }))
        });
    }
}

FissionBloom.id = 'fission-bloom';

module.exports = FissionBloom;
