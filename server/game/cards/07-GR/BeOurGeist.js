const Card = require('../../Card.js');

class BeOurGeist extends Card {
    // Play: Choose a creature in any haunted player's discard
    // pile. Play that creature as if it were in your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'any',
                location: 'discard',
                cardType: 'creature',
                cardCondition: (card) => card.controller.isHaunted(),
                gameAction: ability.actions.playCard()
            }
        });
    }
}

BeOurGeist.id = 'be-our-geist';

module.exports = BeOurGeist;
