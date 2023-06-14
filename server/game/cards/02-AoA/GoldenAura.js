const Card = require('../../Card.js');

class GoldenAura extends Card {
    // Play: Choose a creature. Fully heal the chosen creature. For the remainder of the turn, the chosen creature is considered to be in house Sanctum and cannot be dealt damage.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [
                    ability.actions.heal({ fully: true }),
                    ability.actions.cardLastingEffect({
                        effect: [
                            ability.effects.cardCannot('damage'),
                            ability.effects.changeHouse('sanctum')
                        ]
                    })
                ]
            }
        });
    }
}

GoldenAura.id = 'golden-aura';

module.exports = GoldenAura;
