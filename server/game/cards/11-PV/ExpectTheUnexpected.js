const Card = require('../../Card.js');

class ExpectTheUnexpected extends Card {
    // After your opponent shuffles their discard pile into their deck during their turn, fulfill Expect the Unexpected.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onDeckShuffled: (event, context) =>
                    event.shuffledDiscardIntoDeck && event.player !== context.source.controller
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

ExpectTheUnexpected.id = 'expect-the-unexpected';

module.exports = ExpectTheUnexpected;
