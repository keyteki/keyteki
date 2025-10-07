import Card from '../../Card.js';

class PsychicBug extends Card {
    // Play/Reap: Look at your opponents hand.
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

export default PsychicBug;
