const Card = require('../../Card.js');

class NepetaGigantica extends Card {
    // Action: Stun a creature with power 5 or higher, or stun a Giant creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power >= 5 || card.hasTrait('giant'),
                gameAction: ability.actions.stun()
            }
        });
    }
}

NepetaGigantica.id = 'nepeta-gigantica';

module.exports = NepetaGigantica;
