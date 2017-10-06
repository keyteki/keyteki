const DrawCard = require('../../drawcard.js');

class ContingencyPlan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onHonorDialsRevealed: () => true
            },
           handler: () => {
                this.game.promptWithHandlerMenu(this.controller, {
                    source: this,
                    choices: ['Increase your bid', 'Decrease your bid'],
                    handlers: [
                        () => {
                            this.game.addMessage('{0} uses {1} to increase their bid by 1', this.controller, this);
                            this.controller.honorBid++;
                        },
                        () => {
                            this.game.addMessage('{0} uses {1} to decrease their bid by 1', this.controller, this);
                            this.controller.honorBid--;
                        }
                    ]
                });
            }
        });
    }
}

ContingencyPlan.id = 'contingency-plan';

module.exports = ContingencyPlan;
