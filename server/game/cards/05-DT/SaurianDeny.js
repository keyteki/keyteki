const Card = require('../../Card.js');

class SaurianDeny extends Card {
    //Play: Destroy an enemy creature with A on it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

SaurianDeny.id = 'saurian-deny';

module.exports = SaurianDeny;
