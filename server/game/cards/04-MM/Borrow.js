const Card = require('../../Card.js');

class Borrow extends Card {
    // Play: Take control of an enemy artifact. While under your control, it belongs to house Shadows. (Instead of its original house.)
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
            then: (preThenContext) => ({
                condition: () => !!preThenContext.target,
                gameAction: ability.actions.cardLastingEffect({
                    target: preThenContext.target,
                    duration: 'lastingEffect',
                    condition: () => preThenContext.target.controller === preThenContext.player,
                    effect: ability.effects.changeHouse('shadows')
                })
            })
        });
    }
}

Borrow.id = 'borrow';

module.exports = Borrow;
