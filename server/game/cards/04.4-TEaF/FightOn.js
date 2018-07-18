const DrawCard = require('../../drawcard.js');

class FightOn extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Ready character and move to conflict',
            condition: context => context.player.isDefendingPlayer(),
            target: {
                cardType: 'character',
                location: 'play area',
                controller: 'self',
                cardCondition: card => card.bowed,
                gameAction: [ability.actions.ready(), ability.actions.moveToConflict()]
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}

FightOn.id = 'fight-on';

module.exports = FightOn;
