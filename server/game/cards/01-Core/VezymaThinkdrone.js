const Card = require('../../Card.js');

class VezymaThinkdrone extends Card {
    // Reap: You may archive a friendly creature or artifact from play.
    setupCardAbilities(ability) {
        this.reap({
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
