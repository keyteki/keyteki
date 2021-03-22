const Card = require('../../Card.js');

class FreebooterFaye extends Card {
    //Play: Raise the tide.
    //Reap: Steal 1A if the tide is high.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });

        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

FreebooterFaye.id = 'freebooter-faye';

module.exports = FreebooterFaye;
