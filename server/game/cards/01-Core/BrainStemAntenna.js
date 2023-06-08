const Card = require('../../Card.js');

class BrainStemAntenna extends Card {
    // This creature gains, After you play a Mars creature, ready this creature and for the remainder of the turn it belongs to house Mars.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onCardPlayed: (event, context) =>
                        event.card.hasHouse('mars') &&
                        event.card.type === 'creature' &&
                        event.player === context.player
                },
                gameAction: [
                    ability.actions.ready(),
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.changeHouse('mars')
                    })
                ]
            })
        });
    }
}

BrainStemAntenna.id = 'brain-stem-antenna';

module.exports = BrainStemAntenna;
