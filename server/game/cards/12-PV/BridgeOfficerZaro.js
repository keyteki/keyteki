const Card = require('../../Card.js');

class BridgeOfficerZaro extends Card {
    // After Fight: Capture 3. If you do, ready a friendly non-Alien creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture({ amount: 3 }),
            then: {
                condition: (context) => context.preThenEvent && context.preThenEvent.amount === 3,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => !card.hasTrait('alien'),
                    gameAction: ability.actions.ready()
                },
                message: '{0} uses {1} to ready {2}'
            }
        });
    }
}

BridgeOfficerZaro.id = 'bridge-officer-zaro';

module.exports = BridgeOfficerZaro;
