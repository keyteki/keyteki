const Card = require('../../Card.js');

class Camouflage extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('attack', (context) => !context.source.isOnFlank())
        });
    }
}

Camouflage.id = 'camouflage';

module.exports = Camouflage;
