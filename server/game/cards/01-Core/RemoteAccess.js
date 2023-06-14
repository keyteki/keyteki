const Card = require('../../Card.js');

class RemoteAccess extends Card {
    // Play: Use an opponents artifact as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
    }
}

RemoteAccess.id = 'remote-access';

module.exports = RemoteAccess;
