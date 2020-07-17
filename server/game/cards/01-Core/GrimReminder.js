const Card = require('../../Card.js');

class GrimReminder extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'archive all {1} creatures from their discard pile and gain 1 chain',
            effectArgs: (context) => [context.house],
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
