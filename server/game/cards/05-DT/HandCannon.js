const Card = require('../../Card.js');

class HandCannon extends Card {
    // This creature gains skirmish and, "Fight: Move 1A from the creature this creature fights to your pool."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ skirmish: 1 }),
                ability.effects.gainAbility('fight', {
                    condition: (context) => context.source.amber > 0,
                    gameAction: ability.actions.placeAmber((context) => ({
                        target: context.event.card
                    })),
                    then: {
                        gameAction: ability.actions.removeAmber()
                    },
                    effect: 'move 1 amber from {0} to {1}',
                    effectArgs: (context) => context.event.card
                })
            ]
        });
    }
}

HandCannon.id = 'hand-cannon';

module.exports = HandCannon;
