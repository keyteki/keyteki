const Card = require('../../Card.js');

class HelpFromFutureSelf extends Card {
    // Play: Search your deck and discard pile for a Timetraveller, reveal it, and put it into your hand. Shuffle your discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search for Timetraveller and shuffle discard into their deck',
            gameAction: ability.actions.sequential([
                ability.actions.search({
                    cardName: 'Timetraveller',
                    amount: 1
                }),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.player.discard
                }))
            ])
        });
    }
}

HelpFromFutureSelf.id = 'help-from-future-self';

module.exports = HelpFromFutureSelf;
