const DrawCard = require('../../drawcard.js');

class Levy extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take an honor or a fate from your opponent',
            condition: () => this.controller.opponent,
            target: {
                player: 'opponent',
                mode: 'select',
                choices: {
                    'Give your opponent 1 fate': () => this.controller.opponent.fate > 0,
                    'Give your opponent 1 honor': () => this.controller.opponent.honor > 0
                }
            },
            handler: context => {
                if(context.select === 'Give your opponent 1 fate') {
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

Levy.id = 'levy';

module.exports = Levy;
