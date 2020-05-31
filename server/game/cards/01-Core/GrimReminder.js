const Card = require('../../Card.js');

class GrimReminder extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'archive all {1} creatures from their discard pile',
            effectArgs: (context) => [context.house],
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard.filter((card) => card.hasHouse(context.house))
            }))
        });
    }
}

GrimReminder.id = 'grim-reminder';

module.exports = GrimReminder;
