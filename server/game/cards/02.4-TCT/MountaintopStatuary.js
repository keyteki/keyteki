const DrawCard = require('../../drawcard.js');

class MountaintopStatuary extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Move this to stronghold province',
            when: {
                onDynastyCardTurnedFaceup: (event, context) => event.card === context.source
            },
            effect: 'move it to their stronghold province',
            handler: context => context.player.moveCard(context.source, 'stronghold province')
        });
        this.action({
            title: 'Send a 2 or lower cost character home',
            cost: ability.costs.sacrificeSelf(),
            condition: context => this.game.isDuringConflict() && this.game.currentConflict.conflictProvince.location === context.source.location,
            target: {
                cardType: 'character',
                cardCondition: card => card.isAttacking() && card.costLessThan(3),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

MountaintopStatuary.id = 'mountaintop-statuary';

module.exports = MountaintopStatuary;
