const Card = require('../../Card.js');

class Science extends Card {
    //Play: For the remainder of the turn, gain 1A each time you play another action card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onCardPlayed: (event, context) =>
                        event.player === context.player &&
                        event.card.type === 'action' &&
                        event.card !== context.source
                },
                gameAction: ability.actions.gainAmber()
            })
        });
    }
}

Science.id = 'science';

module.exports = Science;
