const Card = require('../../Card.js');

class IntoTheNight extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'stop all non-Shadows creatures from fighting until the start of their next turn',
            gameAction: ability.actions.lastingEffect({
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
