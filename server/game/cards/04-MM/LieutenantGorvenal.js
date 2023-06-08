const Card = require('../../Card.js');

class LieutenantGorvenal extends Card {
    // After you fight with a creature, Lieutenant Gorvenal captures 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attackerClone.controller === context.source.controller
            },
            gameAction: ability.actions.capture((context) => ({ target: context.source }))
        });
    }
}

LieutenantGorvenal.id = 'lieutenant-gorvenal';

module.exports = LieutenantGorvenal;
