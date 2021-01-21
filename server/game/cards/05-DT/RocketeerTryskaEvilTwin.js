const Card = require('../../Card.js');

class RocketeerTryskaEvilTwin extends Card {
    //Skirmish.
    //While the tide is high, $this enters play ready.
    setupCardAbilities(ability) {
        //Keywords: skirmish
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.entersPlayReady()
        });
    }
}

RocketeerTryskaEvilTwin.id = 'rocketeer-tryska-evil-twin';

module.exports = RocketeerTryskaEvilTwin;
