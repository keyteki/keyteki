const DrawCard = require('../../../drawcard.js');

class CrossroadsSellsword extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => (
                    card === this &&
                    this.controller === card.controller &&
                    this.game.currentPhase === 'challenge')
            },
            handler: () => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 gold', this.controller, this);
            }
        });
    }
}

CrossroadsSellsword.code = '03029';

module.exports = CrossroadsSellsword;
