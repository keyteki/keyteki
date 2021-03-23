const Card = require('../../Card.js');

class FreebooterFayeEvilTwin extends Card {
    //Play: Raise the tide.
    //Before Fight: If the tide is high, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });

        this.beforeFight({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

FreebooterFayeEvilTwin.id = 'freebooter-faye-evil-twin';

module.exports = FreebooterFayeEvilTwin;
