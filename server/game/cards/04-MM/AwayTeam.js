const Card = require('../../Card.js');

class AwayTeam extends Card {
    // Destroyed: Put each upgrade on Away Team into its owners archives.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.archive((context) => ({ target: context.source.upgrades }))
        });
    }
}

AwayTeam.id = 'away-team';

module.exports = AwayTeam;
