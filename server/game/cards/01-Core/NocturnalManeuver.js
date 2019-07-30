const Card = require('../../Card.js');

class NocturnalManeuver extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.exhaust({used: false})
            }
        });
    }
}

NocturnalManeuver.id = 'nocturnal-maneuver';

module.exports = NocturnalManeuver;
