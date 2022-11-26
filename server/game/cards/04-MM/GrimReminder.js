const Card = require('../../Card.js');

class GrimReminder extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect:
                'archive all {1} creatures from their discard pile, including {2}, then gain 1 chain',
            effectArgs: (context) => {
                const recurredCreatures = context.player.discard.filter(
                    (card) => card.type === 'creature' && card.hasHouse(context.house)
                );
                return [
                    context.house,
                    recurredCreatures.length > 0 ? recurredCreatures : 'nothing'
                ];
            },
            gameAction: [
                ability.actions.archive((context) => ({
                    target: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse(context.house)
                    )
                })),
                ability.actions.gainChains({ amount: 1 })
            ]
        });
    }
}

GrimReminder.id = 'grim-reminder';

module.exports = GrimReminder;
