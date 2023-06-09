const Card = require('../../Card.js');

class Exhume extends Card {
    // Play: Choose a creature in your discard pile. You may play that creature as if it belonged to the active house and was in your hand.
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
