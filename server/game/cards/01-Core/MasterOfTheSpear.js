const DrawCard = require('../../drawcard.js');

class MasterOfTheSpear extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send home character',
            condition: () => this.isAttacking(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to send home',
                controller: 'opponent',
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

MasterOfTheSpear.id = 'master-of-the-spear';

module.exports = MasterOfTheSpear;
