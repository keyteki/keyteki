const Card = require('../../Card.js');

class RaidingKnight extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture()
        });
    }
}

RaidingKnight.id = 'raiding-knight'; // This is a guess at what the id might be - please check it!!!

module.exports = RaidingKnight;
