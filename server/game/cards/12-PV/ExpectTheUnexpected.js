import Card from '../../Card.js';

class ExpectTheUnexpected extends Card {
    // During your opponent’s turn, after your opponent shuffles their deck, fulfill Expect the Unexpected.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onDeckShuffled: (event, context) => event.player !== context.source.controller
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

ExpectTheUnexpected.id = 'expect-the-unexpected';

export default ExpectTheUnexpected;
