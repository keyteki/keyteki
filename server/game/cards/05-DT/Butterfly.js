const Card = require('../../Card.js');

class Butterfly extends Card {
    //Play: Destroy a friendly Cocoon. If you do not, destroy Butterfly.
    //Fight/Reap: Fully heal Butterfly. Gain 1A.
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a Cocoon to destroy',
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.name === 'Cocoon?', // TODO replace this with final name for Cocoon
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

        this.fight({
            reap: true,
            gameAction: ability.actions.sequential([
                ability.actions.heal({ fully: true }),
                ability.actions.gainAmber({ amount: 1 })
            ])
        });
    }
}

Butterfly.id = 'butterfly';

module.exports = Butterfly;
