const Card = require('../../Card.js');

class SubjectKirby extends Card {
    // Play/Fight/Reap: You may play a non-Star Alliance creature this turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: 'allow them to play one non staralliance creature this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse({
                    house: 'staralliance',
                    condition: (card) => card.type === 'creature'
                })
            })
        });
    }
}

SubjectKirby.id = 'subject-kirby';

module.exports = SubjectKirby;
