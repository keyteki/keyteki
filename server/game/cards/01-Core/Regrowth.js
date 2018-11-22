const Card = require('../../Card.js');

class Regrowth extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Regrowth.id = 'regrowth'; // This is a guess at what the id might be - please check it!!!

module.exports = Regrowth;
