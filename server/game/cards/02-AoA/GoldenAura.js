const Card = require('../../Card.js');

class GoldenAura extends Card {
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
