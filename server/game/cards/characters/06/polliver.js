const DrawCard = require('../../../drawcard.js');

class Polliver extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: (event, challenge, card, discarded) => card === this && discarded.getType() === 'character' && this.opponentHasGold()
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                this.game.addGold(otherPlayer, -2);
                this.game.addMessage('{0} uses {1} have {2} return 2 gold to the treasury', this.controller, this, otherPlayer);
            }
        });
    }

    opponentHasGold() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return otherPlayer.gold >= 1;
    }
}

Polliver.code = '06029';

module.exports = Polliver;
