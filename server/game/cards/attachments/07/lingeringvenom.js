const DrawCard = require('../../../drawcard.js');

class LingeringVenom extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller
            },
            handler: () => {
                this.addToken('venom', 1);
                this.game.addMessage('{0} uses {1} to place a venom token on {1}', this.controller, this);

                if(this.parent.getStrength() <= this.tokens['venom']) {
                    this.parent.controller.killCharacter(this.parent);
                    this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, this.parent);
                }
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

LingeringVenom.code = '07032';

module.exports = LingeringVenom;
