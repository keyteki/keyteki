const Card = require('../../Card.js');

class SpeedSigil extends Card {
    // The first creature played each turn enters play ready.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
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

SpeedSigil.id = 'speed-sigil';

module.exports = SpeedSigil;
