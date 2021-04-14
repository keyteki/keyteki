const Card = require('../../Card.js');

class ProfGarwynne extends Card {
    //elusive.
    //Fight: You may choose a card from your archives and put it in your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfGarwynne.id = 'prof-garwynne';

module.exports = ProfGarwynne;
