const Card = require('../../Card.js');

class EnlistNumeri extends Card {
    // Play: Take control of an enemy creature with A on it. While under your control, it belongs to house Saurian. (Instead of its original house.)
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    }))
                ],
                effect: 'take control of {0}'
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.cardLastingEffect({
                    target: preThenContext.target,
                    duration: 'lastingEffect',
                    condition: (context, effect) =>
                        effect.match.controller === preThenContext.player,
                    effect: ability.effects.changeHouse('saurian')
                })
            })
        });
    }
}

EnlistNumeri.id = 'enlist-numeri';

module.exports = EnlistNumeri;
