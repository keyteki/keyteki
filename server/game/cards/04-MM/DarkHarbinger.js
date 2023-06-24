const Card = require('../../Card.js');

class DarkHarbinger extends Card {
    // After you play an Untamed action card, ready Dark Harbinger.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasHouse('untamed') &&
                    event.card.type === 'action' &&
                    event.player === context.player
            },
            gameAction: ability.actions.ready()
        });
    }
}

DarkHarbinger.id = 'dark-harbinger';

module.exports = DarkHarbinger;
