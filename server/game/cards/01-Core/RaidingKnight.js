const Card = require('../../Card.js');

class RaidingKnight extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });
    }
}

RaidingKnight.id = 'raiding-knight';

module.exports = RaidingKnight;
