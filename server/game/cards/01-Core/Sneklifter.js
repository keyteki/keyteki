const Card = require('../../Card.js');

class Sneklifter extends Card {
    // Play: Take control of an enemy artifact. While under your control, if it does not belong to one of your 3 houses, it is considered to be of house Shadows.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}',
            then: (preThenContext) => {
                return {
                    alwaysTriggers: true,
                    condition: () =>
                        preThenContext.player.houses.every(
                            (house) => !preThenContext.target.hasHouse(house)
                        ),
                    gameAction: ability.actions.cardLastingEffect({
                        target: preThenContext.target,
                        duration: 'lastingEffect',
                        condition: () => preThenContext.target.controller === preThenContext.player,
                        effect: ability.effects.changeHouse('shadows')
                    })
                };
            }
        });
    }
}

Sneklifter.id = 'sneklifter';

module.exports = Sneklifter;
