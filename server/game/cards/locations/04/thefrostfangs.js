const DrawCard = require('../../../drawcard.js');

class TheFrostfangs extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to give control of {1} to {2}', this.controller, this, otherPlayer);
                this.game.takeControl(otherPlayer, this);
            }
        });
        this.plotModifiers({
            reserve: -1
        });
    }
}

TheFrostfangs.code = '04098';

module.exports = TheFrostfangs;
