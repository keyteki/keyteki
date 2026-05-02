const Card = require('../../Card.js');

class Sparkscheme extends Card {
    // Entrench. After an enemy creature reaps, if Sparkscheme is exhausted, draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller &&
                    context.source.exhausted
            },
            gameAction: ability.actions.draw()
        });
    }
}

Sparkscheme.id = 'sparkscheme';

module.exports = Sparkscheme;
