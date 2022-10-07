const Card = require('../../Card.js');

class KeyCharge extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                gameAction: ability.actions.forgeKey({ may: true })
            }
        });
    }
}

KeyCharge.id = 'key-charge';

module.exports = KeyCharge;
