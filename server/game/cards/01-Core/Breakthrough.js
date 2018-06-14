const DrawCard = require('../../drawcard.js');

class Breakthrough extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Declare a new conflict',
            when: {
                onConflictFinished: (event, context) => event.conflict.attackingPlayer === context.player &&
                                                        event.conflict.winner === context.player && 
                                                        event.conflict.conflictProvince.isBroken
            },
            gameAction: ability.actions.initiateConflict({ canPass: false })
        });
    }
}

Breakthrough.id = 'breakthrough';

module.exports = Breakthrough;
