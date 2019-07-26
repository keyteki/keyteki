const Card = require('../../Card.js');

class SkyboosterSquadron extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.returnToHand()
        });
    }
}

SkyboosterSquadron.id = 'skybooster-squadron';

module.exports = SkyboosterSquadron;
