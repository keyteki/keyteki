const DrawCard = require('../../drawcard.js');

class ContingencyPlan extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Change your bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            gameAction: ability.actions.modifyBid({ promptPlayer: true })
        });
    }
}

ContingencyPlan.id = 'contingency-plan';

module.exports = ContingencyPlan;
