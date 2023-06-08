const Card = require('../../Card.js');

class RaidingKnight extends Card {
    // Play: Capture 1<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });
    }
}

RaidingKnight.id = 'raiding-knight';

module.exports = RaidingKnight;
