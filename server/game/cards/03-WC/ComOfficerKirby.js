const Card = require('../../Card.js');

class ComOfficerKirby extends Card {
    // Play/Fight/Reap: You may play a non-Star Alliance artifact, upgrade, or action card this turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect:
                'allow them to play one non staralliance artifact, upgrade, or action​ card this turn',
            gameAction: ability.actions.forRemainderOfTurn({
                effect: ability.effects.canPlayNonHouse({
                    house: 'staralliance',
                    condition: (card) => ['action', 'artifact', 'upgrade'].includes(card.type)
                })
            })
        });
    }
}

ComOfficerKirby.id = 'com-officer-kirby';

module.exports = ComOfficerKirby;
