const Card = require('../../Card.js');

class EclecticInquiry extends Card {
    // Play: Archive the top 2 cards of your deck.
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive the top two cards of their deck',
            gameAction: ability.actions.archive((context) => ({
                target:
                    context.player.deck.slice.length > 0
                        ? context.player.deck.slice(0, Math.min(context.player.deck.length, 2))
                        : []
            }))
        });
    }
}

EclecticInquiry.id = 'eclectic-inquiry';

module.exports = EclecticInquiry;
