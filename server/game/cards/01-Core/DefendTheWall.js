const ProvinceCard = require('../../provincecard.js');

class DefendTheWall extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => event.conflict.conflictProvince === context.source &&
                                                   event.conflict.winner === context.player
            },
            gameAction: ability.actions.resolveRing()
        });
    }
}

DefendTheWall.id = 'defend-the-wall';

module.exports = DefendTheWall;
