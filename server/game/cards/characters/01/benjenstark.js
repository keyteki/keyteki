const DrawCard = require('../../../drawcard.js');

class BenjenStark extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => {
                    if(card !== this || player !== card.controller) {
                        return false;
                    }

                    event.cancel = true;

                    return true;
                }
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 2 power for their faction and shuffles {1} back into their deck instead of placing it in their dead pile', this.controller, this);

                this.game.addPower(this.controller, 2);
                this.controller.moveCard(this, 'draw deck');
                this.controller.shuffleDrawDeck();
            },
            onCancel: () => {
                this.controller.moveCard(this, 'dead pile');
            }
        });
    }
}

BenjenStark.code = '01122';

module.exports = BenjenStark;
