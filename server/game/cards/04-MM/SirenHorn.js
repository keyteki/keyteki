const Card = require('../../Card.js');

class SirenHorn extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('beforeFight', {
                condition: (context) => context.source.tokens.amber,
                effect: 'move 1 amber from {0} to {1}',
                effectArgs: (context) => context.event.card,
                gameAction: [
                    ability.actions.removeAmber((context) => ({
                        target: context.source
                    })),
                    ability.actions.placeAmber((context) => ({
                        target: context.event.card
                    }))
                ]
            })
        });
    }
}

SirenHorn.id = 'siren-horn';

module.exports = SirenHorn;
