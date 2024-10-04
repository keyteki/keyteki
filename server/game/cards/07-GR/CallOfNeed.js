const Card = require('../../Card.js');

class CallOfNeed extends Card {
    // Play: Search your deck for a card and discard it.
    setupCardAbilities(ability) {
        this.play({
            effect: 'search deck for a card and discard it',
            gameAction: ability.actions.search({
                location: ['deck'],
                amount: 1,
                destination: 'discard'
            })
        });
    }
}

CallOfNeed.id = 'call-of-need';

module.exports = CallOfNeed;
