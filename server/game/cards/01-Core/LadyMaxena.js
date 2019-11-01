const Card = require('../../Card.js');

class LadyMaxena extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });

        this.action({
            gameAction: ability.actions.returnToHand()
        });
    }
}

LadyMaxena.id = 'lady-maxena';

module.exports = LadyMaxena;
