const Card = require('../../Card.js');

class CaptainCha extends Card {
    // Elusive.
    // After Reap: Steal 1 amber.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.steal()
        });
    }
}

CaptainCha.id = 'captain-cha';

module.exports = CaptainCha;
