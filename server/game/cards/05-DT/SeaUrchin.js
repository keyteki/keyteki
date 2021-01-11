const Card = require('../../Card.js');

class SeaUrchin extends Card {
    //Poison. (Any damage dealt by this creature's power during a fight destroys the damaged creature.)
    //Play: Capture 1A. If the tide is high, steal 1A instead.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !context.player.isTideHigh(),
            gameAction: ability.actions.capture()
        });

        this.play({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

SeaUrchin.id = 'sea-urchin';

module.exports = SeaUrchin;
