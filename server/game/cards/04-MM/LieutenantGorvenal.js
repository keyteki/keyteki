const Card = require('../../Card.js');

class LieutenantGorvenal extends Card {
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
