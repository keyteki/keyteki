const DrawCard = require('../../../drawcard.js');

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event, challenge, source, target) => source === this && !target.isLoyal()
            },
            choices: {
                'Draw 1 card': () => {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                },
                'Gain 1 gold': () => {
                    this.game.addGold(this.controller, 1);
                    this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                }
            }
        });
    }
}

SerDavosSeaworth.code = '04087';

module.exports = SerDavosSeaworth;
