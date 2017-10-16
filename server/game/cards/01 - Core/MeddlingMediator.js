const DrawCard = require('../../drawcard.js');

class MeddlingMediator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take 1 fate or 1 honor',
            condition: () => this.controller.opponent.conflicts.complete === 2,
            target: {
                mode: 'select',
                choices: {
                    'Take 1 fate': () => this.controller.opponent.fate > 0,
                    'Take 1 honor': () => this.controller.opponent.honor > 0
                }
            },
            handler: context => {
                if(context.target === 'Take 1 fate') {
                    this.game.addMessage('{0} uses {1} to take 1 fate from {2}', this.controller, this, this.controller.opponent);
                    this.game.transferFate(this.controller, this.controller.opponent, 1);
                } else {
                    this.game.addMessage('{0} uses {1} to take 1 honor from {2}', this.controller, this, this.controller.opponent);
                    this.game.transferHonor(this.controller.opponent, this.controller, 1);
                }
            }
        });
    }
}

MeddlingMediator.id = 'meddling-mediator';

module.exports = MeddlingMediator;
