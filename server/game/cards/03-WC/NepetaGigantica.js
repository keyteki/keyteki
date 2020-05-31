const Card = require('../../Card.js');

class NepetaGigantica extends Card {
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
