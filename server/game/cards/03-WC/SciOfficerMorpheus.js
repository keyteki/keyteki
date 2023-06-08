const Card = require('../../Card.js');

class SciOfficerMorpheus extends Card {
    // After you play a creature with a play effect, trigger its play effect an additional time.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.player === context.player &&
                    event.card.abilities.reactions.some(
                        (ability) =>
                            ability.properties.name === 'Play' &&
                            Object.keys(ability.when).some((key) => key === 'onCardPlayed')
                    )
            },
            effect: 'trigger the play effect of {1} an additional time',
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.resolveAbility((context) => ({
                target: context.event.card,
                ability: (ability) => ability.isPlay()
            }))
        });
    }
}

SciOfficerMorpheus.id = 'sci-officer-morpheus';

module.exports = SciOfficerMorpheus;
