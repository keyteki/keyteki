const Card = require('../../Card.js');

class VezymaThinkdrone extends Card {
    setupCardAbilities(ability) {
        this.reap({
            may: 'archive a friendly creature or artifact',
            target: {
                cardType: ['creature', 'artifact'],
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

VezymaThinkdrone.id = 'vezyma-thinkdrone'; // This is a guess at what the id might be - please check it!!!

module.exports = VezymaThinkdrone;
