const DrawCard = require('../../drawcard.js');

class DojiChallenger extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                controller: 'opponent',
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

DojiChallenger.id = 'doji-challenger';

module.exports = DojiChallenger;
