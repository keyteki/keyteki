const Card = require('../../Card.js');

class NocturnalManeuver extends Card {
    // Play: Exhaust up to 3 creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

NocturnalManeuver.id = 'nocturnal-maneuver';

module.exports = NocturnalManeuver;
