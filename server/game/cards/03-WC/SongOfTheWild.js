const Card = require('../../Card.js');

class SongOfTheWild extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                "give each friendly creature 'Reap: Gain 1 amber' for the remainder of the turn",
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onReap: () => true
                },
                gameAction: ability.actions.gainAmber({ target: context.player })
            }))
        });
    }
}

SongOfTheWild.id = 'song-of-the-wild';

module.exports = SongOfTheWild;
