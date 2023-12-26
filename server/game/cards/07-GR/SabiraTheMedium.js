const Card = require('../../Card.js');

class SabiraTheMedium extends Card {
    // After you shuffle your discard pile into your deck, gain 3.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDiscardShuffledIntoDeck: (event, context) => {
                    return event.player === context.player;
                }
            },
            gameAction: ability.actions.gainAmber({ amount: 3 })
        });
    }
}

SabiraTheMedium.id = 'sabira-the-medium';

module.exports = SabiraTheMedium;
