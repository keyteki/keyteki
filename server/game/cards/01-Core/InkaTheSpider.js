const Card = require('../../Card.js');

class InkaTheSpider extends Card {
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
