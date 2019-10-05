const Card = require('../../Card.js');

class Exhume extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'creature',
                optional: true,
                gameAction: ability.actions.playCard()
            }
        });
    }
}

Exhume.id = 'exhume';

module.exports = Exhume;
