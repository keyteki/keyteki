const Card = require('../../Card.js');

class AutoEncoder extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && event.card.controller === context.player
            },
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

AutoEncoder.id = 'auto-encoder';

module.exports = AutoEncoder;
