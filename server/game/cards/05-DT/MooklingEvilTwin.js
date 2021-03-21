const Card = require('../../Card.js');

class MooklingEvilTwin extends Card {
    //After your opponent forges a key, for each A spent to forge the key, give $this a +1 power counter.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.addPowerCounter((event) => ({
                //amount: event.modifier * -1
                amount: event.player.getCurrentKeyCost()
            }))
        });
    }
}

MooklingEvilTwin.id = 'mookling-evil-twin';

module.exports = MooklingEvilTwin;
