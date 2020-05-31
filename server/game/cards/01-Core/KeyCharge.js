const Card = require('../../Card.js');

class KeyCharge extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                may: 'forge a key',
                gameAction: ability.actions.forgeKey()
            }
        });
    }
}

KeyCharge.id = 'key-charge';

module.exports = KeyCharge;
