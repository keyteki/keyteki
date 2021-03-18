const Card = require('../../Card.js');

class Chelonia extends Card {
    //Elusive.
    //After you play another creature, if the tide is high, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === 'creature' &&
                    event.card !== context.source
            },
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.gainAmber()
        });
    }
}

Chelonia.id = 'chelonia';

module.exports = Chelonia;
