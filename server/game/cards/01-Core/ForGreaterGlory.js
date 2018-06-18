const DrawCard = require('../../drawcard.js');

class ForGreaterGlory extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a fate on all your bushi in this conflict',
            when: {
                onBreakProvince: (event, context) => this.game.isDuringConflict('military') && event.conflict.attackingPlayer === context.player
            },
            gameAction: ability.actions.placeFate(context => ({
                target: context.event.conflict.getCharacters(context.player).filter(card => card.hasTrait('bushi'))
            })),
            max: ability.limit.perConflict(1)
        });
    }
}

ForGreaterGlory.id = 'for-greater-glory';

module.exports = ForGreaterGlory;
