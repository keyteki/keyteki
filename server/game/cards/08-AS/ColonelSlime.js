const Card = require('../../Card.js');

class ColonelSlime extends Card {
    // Scrap: A friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

ColonelSlime.id = 'colonel-slime';

module.exports = ColonelSlime;
