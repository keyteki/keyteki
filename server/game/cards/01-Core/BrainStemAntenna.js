const Card = require('../../Card.js');

class BrainStemAntenna extends Card {
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
                    ability.actions.cardLastingEffect({ effect: ability.effects.addHouse('mars') })
                ]
            })
        });
    }
}

BrainStemAntenna.id = 'brain-stem-antenna';

module.exports = BrainStemAntenna;
