const DrawCard = require('../../drawcard.js');

class GuardDuty extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: () => this.parent.isDefending(),
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, this.parent);
                this.game.applyGameAction(context, { honor: context.source.parent });
            }
        });
    }
}

GuardDuty.id = 'guard-duty';

module.exports = GuardDuty;
