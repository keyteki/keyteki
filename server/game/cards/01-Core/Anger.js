const Card = require('../../Card.js');

class Anger extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            }
        });
    }
}

Anger.id = 'anger'; // This is a guess at what the id might be - please check it!!!

module.exports = Anger;
