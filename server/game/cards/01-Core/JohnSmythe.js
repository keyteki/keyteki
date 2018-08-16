const Card = require('../../Card.js');

class JohnSmythe extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                cardCondition: card => !card.hasTrait('agent') && card.hasHouse('mars'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

JohnSmythe.id = 'john-smythe'; // This is a guess at what the id might be - please check it!!!

module.exports = JohnSmythe;
