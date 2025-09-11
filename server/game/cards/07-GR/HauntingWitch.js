const Card = require('../../Card.js');

class HauntingWitch extends Card {
    // After you play a creature, if you are haunted, gain 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player && event.card.type === 'creature'
            },
            condition: (context) => context.player.isHaunted(),
            gameAction: ability.actions.gainAmber()
        });
    }
}

HauntingWitch.id = 'haunting-witch';

module.exports = HauntingWitch;
