const Card = require('../../Card.js');

class Cauldron extends Card {
    // Omni: Put the top card of your deck faceup under Cauldron. If
    // there are 3 or more cards under Cauldron, play them one at a
    // time as if they were in your hand.
    setupCardAbilities(ability) {
        this.omni({
            condition: (context) => context.player.deck.length > 0,
            gameAction: ability.actions.placeUnder((context) => ({
                target: context.player.deck[0],
                parent: context.source
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.source.childCards.length >= 3,
                gameAction: ability.actions.sequentialPlay((context) => ({
                    forEach: context.source.childCards
                }))
            }
        });
    }
}

Cauldron.id = 'cauldron';

module.exports = Cauldron;
