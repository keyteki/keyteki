const Card = require('../../Card.js');

class Harmonia extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && event.player === context.player && event.card !== context.source
            },
            gameAction: ability.actions.gainAmber(context => ({
                amount: context.player.creaturesInPlay.length < context.player.opponent.creaturesInPlay.length ? 1 : 0
            }))
        });
    }
}

Harmonia.id = 'harmonia';

module.exports = Harmonia;
