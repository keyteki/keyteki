const Card = require('../../Card.js');

class RocketeerTryskaEvilTwin extends Card {
    // Skirmish.
    // (T) While the tide is high, Rocketeer Tryska enters play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.entersPlayReady()
        });
    }
}

RocketeerTryskaEvilTwin.id = 'rocketeer-tryska-evil-twin';

module.exports = RocketeerTryskaEvilTwin;
