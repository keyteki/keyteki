const DrawCard = require('../../drawcard.js');

class WayOfTheCrane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isFaction('crane'),
                gameAction: ability.actions.honor()
            }
        });
    }
}

WayOfTheCrane.id = 'way-of-the-crane';

module.exports = WayOfTheCrane;
