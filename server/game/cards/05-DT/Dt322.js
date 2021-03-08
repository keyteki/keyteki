const Card = require('../../Card.js');

class Dt322 extends Card {
    //Play: For the remainder of the turn, after you play another card, exhaust a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn({
                when: {
                    onCardPlayed: (event, context) =>
                        event.player === context.player && event.card !== context.source
                },
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.exhaust()
                }
            })
        });
    }
}

Dt322.id = 'dt322';

module.exports = Dt322;
