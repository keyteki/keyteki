const DrawCard = require('../../../drawcard.js');

class BastardDaughter extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => (
                    this.controller === card.controller &&
                    (card.name === 'Bastard Daughter' || card.name === 'The Red Viper')
                )
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return true;
                }

                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand', this.controller, this, otherPlayer);

                otherPlayer.discardAtRandom(1);
            }
        });
    }
}

BastardDaughter.code = '02015';

module.exports = BastardDaughter;
