const Card = require('../../Card.js');

class PsychicBug extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.reveal(context => ({ target: context.player.opponent.hand }))
        });
    }
}

PsychicBug.id = 'psychic-bug'; // This is a guess at what the id might be - please check it!!!

module.exports = PsychicBug;
