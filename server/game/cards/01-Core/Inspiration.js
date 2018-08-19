const Card = require('../../Card.js');

class Inspiration extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            }
        });
    }
}

Inspiration.id = 'inspiration'; // This is a guess at what the id might be - please check it!!!

module.exports = Inspiration;
