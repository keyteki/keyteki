const Card = require('../../Card.js');

class Cocoon extends Card {
    //Play: Destroy a friendly Larva. If you do not, destroy Cocoon.
    //Action: Return a Butterfly from your discard pile to your hand.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a Larva to destroy',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.name === 'Larva?', // TODO replace this with final name for Larva
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.filter((event) => !event.cancelled).length === 0,
                gameAction: ability.actions.destroy()
            }
        });

        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                cardCondition: (card) => card.name === 'Butterfly?', // TODO: replace with final name for Butterfly
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Cocoon.id = 'cocoon';

module.exports = Cocoon;
