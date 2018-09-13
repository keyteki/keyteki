const Card = require('../../Card.js');

class HuntingWitch extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && event.player === context.player && event.card !== context.source
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

HuntingWitch.id = 'hunting-witch'; // This is a guess at what the id might be - please check it!!!

module.exports = HuntingWitch;
