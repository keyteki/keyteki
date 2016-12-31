const DrawCard = require('../../../drawcard.js');

class Bronn extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onChallenge', 'onChallengeFinished']);
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to take control of Bronn',
            method: 'takeControl',
            phase: 'marshal',
            anyPlayer: true
        });
    }

    onChallenge(e, challenge) {
        if(this.controller !== challenge.defendingPlayer) {
            return;
        }

        this.setIcon('military');
        this.setIcon('intrigue');
        this.setIcon('power');
    }

    onChallengeFinished(e, challenge) {
        if(this.controller !== challenge.defendingPlayer) {
            return;
        }

        this.clearIcon('military');
        this.clearIcon('intrigue');
        this.clearIcon('power');
    }

    takeControl(player) {
        if(player === this.controller || player.gold < 1) {
            return false;
        }

        this.game.addMessage('{0} pays 1 gold to take control of {1}', player, this);

        player.gold--;

        this.game.takeControl(player, this);
    }
}

Bronn.code = '02089';

module.exports = Bronn;
