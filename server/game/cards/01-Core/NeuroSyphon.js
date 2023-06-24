const Card = require('../../Card.js');

class NeuroSyphon extends Card {
    // Play: If your opponent has more <A> than you, steal 1<A> and draw a card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            effect: 'steal an amber and draw a card',
            gameAction: [ability.actions.steal(), ability.actions.draw()]
        });
    }
}

NeuroSyphon.id = 'neuro-syphon';

module.exports = NeuroSyphon;
