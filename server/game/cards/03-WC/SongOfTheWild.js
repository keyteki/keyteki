const Card = require('../../Card.js');

class SongOfTheWild extends Card {
    // Play: For the remainder of the turn, each friendly creature gains, Reap: Gain 1A.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "give each friendly creature 'Reap: Gain 1 amber' for the remainder of the turn",
            gameAction: ability.actions.forRemainderOfTurn({
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.gainAmber()
                })
            })
        });
    }
}

SongOfTheWild.id = 'song-of-the-wild';

module.exports = SongOfTheWild;
