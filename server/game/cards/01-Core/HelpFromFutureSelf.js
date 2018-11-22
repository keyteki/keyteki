const Card = require('../../Card.js');

class HelpFromFutureSelf extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.search({ cardName: 'Timetraveller' })
        });
    }
}

HelpFromFutureSelf.id = 'help-from-future-self'; // This is a guess at what the id might be - please check it!!!

module.exports = HelpFromFutureSelf;
