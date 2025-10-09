const Card = require('../../Card.js');

class IntoTheNight extends Card {
    // Play: Until the start of your next turn, non-Shadows creatures cannot be used to fight.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'stop all non-Shadows creatures from fighting until the start of their next turn',
            effectAlert: true,
            gameAction: ability.actions.untilNextTurn({
                targetController: 'any',
                effect: ability.effects.cardCannot(
                    'fight',
                    (context) =>
                        context.source.type === 'creature' && !context.source.hasHouse('shadows')
                )
            })
        });
    }
}

IntoTheNight.id = 'into-the-night';

module.exports = IntoTheNight;
