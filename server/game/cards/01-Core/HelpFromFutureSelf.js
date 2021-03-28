const Card = require('../../Card.js');

class HelpFromFutureSelf extends Card {
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
