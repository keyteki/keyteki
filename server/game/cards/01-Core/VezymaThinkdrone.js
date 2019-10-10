const Card = require('../../Card.js');

class VezymaThinkdrone extends Card {
    setupCardAbilities(ability) {
        this.reap({
            may: 'archive a friendly creature or artifact',
            target: {
                optional: true,
                cardType: ['creature', 'artifact'],
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

VezymaThinkdrone.id = 'vezyma-thinkdrone';

module.exports = VezymaThinkdrone;
