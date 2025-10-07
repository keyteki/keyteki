import Card from '../../Card.js';

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
            then: (context) => ({
                gameAction: ability.actions.cardLastingEffect({
                    target: context.target,
                    duration: 'lastingEffect',
                    until: {
                        onTakeControl: (event) =>
                            event.card === context.target &&
                            event.player === context.player.opponent
                    },
                    effect: ability.effects.changeHouse('saurian')
                })
            })
        });
    }
}

EnlistNumeri.id = 'enlist-numeri';

export default EnlistNumeri;
