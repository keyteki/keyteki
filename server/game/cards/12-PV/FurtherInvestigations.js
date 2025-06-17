const Card = require('../../Card.js');

class FurtherInvestigations extends Card {
    // Play: Destroy any number of friendly creatures. For each creature destroyed this way, archive a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'unlimited',
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents.filter((event) => !event.cancelled).length > 0,
                target: {
                    mode: 'exactly',
                    numCards: (context) =>
                        context.preThenEvents.filter((event) => !event.cancelled).length,
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.archive()
                },
                message: '{0} uses {1} to archive {3} cards',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.preThenEvents.filter((event) => !event.cancelled).length
                ]
            }
        });
    }
}

FurtherInvestigations.id = 'further-investigations';

module.exports = FurtherInvestigations;
