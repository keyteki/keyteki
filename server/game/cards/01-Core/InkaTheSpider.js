const Card = require('../../Card.js');

class InkaTheSpider extends Card {
    // Poison.(Any damage dealt by this creatures power during a fight destroys the damaged creature.)
    // Play/Reap: Stun a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            },
            reap: true
        });
    }
}

InkaTheSpider.id = 'inka-the-spider';

module.exports = InkaTheSpider;
