const Card = require('../../Card.js');

class CropCircles extends Card {
    // Play: A non-Mars creature captures 1A from its own side. You may purge
    // any number of cards from your archives. The same creature captures an
    // additional 1A from its own side for each card purged in this way.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                creature: {
                    cardType: 'creature',
                    cardCondition: (c) => !c.hasHouse('mars'),
                    optional: true,
                    gameAction: ability.actions.capture((context) => ({
                        amount: 1,
                        player: context.targets.creature?.controller,
                        allowNoAmber: true
                    }))
                },
                archives: {
                    activePromptTitle: 'Choose which cards to purge',
                    mode: 'unlimited',
                    controller: 'self',
                    location: 'archives',
                    gameAction: ability.actions.purge()
                }
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.targets.creature,
                gameAction: ability.actions.capture((context) => ({
                    target: preThenContext.targets.creature,
                    player: preThenContext.targets.creature?.controller,
                    amount: context.preThenEvents.filter((e) => e.card.location === 'purged').length
                }))
            })
        });
    }
}

CropCircles.id = 'crop-circles';

module.exports = CropCircles;
