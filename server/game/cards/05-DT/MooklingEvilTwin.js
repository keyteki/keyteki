import Card from '../../Card.js';

class MooklingEvilTwin extends Card {
    // After your opponent forges a key, give Mookling a +1 power counter for each A spent to forge that key.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.addPowerCounter((context) => ({
                amount: context.event.amberSpent
            }))
        });
    }
}

MooklingEvilTwin.id = 'mookling-evil-twin';

export default MooklingEvilTwin;
