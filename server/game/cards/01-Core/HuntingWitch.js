const Card = require('../../Card.js');

class HuntingWitch extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.player === context.player &&
                    event.card !== context.source
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

HuntingWitch.id = 'hunting-witch';

module.exports = HuntingWitch;
