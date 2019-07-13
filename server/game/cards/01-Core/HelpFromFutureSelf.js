const Card = require('../../Card.js');

class HelpFromFutureSelf extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.search({
                cardName: 'Timetraveller',
                amount: 1,
                discardToDeck: true
            })
        });
    }
}

HelpFromFutureSelf.id = 'help-from-future-self';

module.exports = HelpFromFutureSelf;
