const Card = require('../../Card.js');

class Card322 extends Card {
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

Card322.id = 'card-322';

module.exports = Card322;
