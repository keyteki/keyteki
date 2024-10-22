const Card = require('../../Card.js');

class Titanarpon extends Card {
    // The first creature you play each turn enters play ready.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) =>
                context.player === this.game.activePlayer &&
                context.game.cardsPlayed.filter((card) => card.type === 'creature').length === 0,
            effect: ability.effects.entersPlayReady()
        });

        this.interrupt({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    context.player === this.game.activePlayer &&
                    context.game.cardsPlayed.filter((card) => card.type === 'creature').length === 0
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.event.card,
                targetLocation: 'any',
                effect: ability.effects.entersPlayReady()
            }))
        });
    }
}

Titanarpon.id = 'titanarpon';

module.exports = Titanarpon;
