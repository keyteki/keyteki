const Card = require('../../Card.js');

class PsychicBug extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.opponent.hand
            }))
        });
    }
}

PsychicBug.id = 'psychic-bug';

module.exports = PsychicBug;
