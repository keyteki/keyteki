const DrawCard = require('../../../drawcard.js');
 
class Bronn extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Pay 1 gold to take control of Bronn', command: 'menuItem', method: 'takeControl', anyPlayer: true });

        this.registerEvents(['onChallenge', 'onChallengeFinished']);
    }

    onChallenge(challenge) {
        if(!this.inPlay || this.controller !== challenge.defendingPlayer) {
            return;
        }

        this.setIcon('military');
        this.setIcon('intrigue');
        this.setIcon('power');
    }

    onChallengeFinished(challenge) {
        if(!this.inPlay || this.controller !== challenge.defendingPlayer) {
            return;
        }

        this.clearIcon('military');
        this.clearIcon('intrigue');
        this.clearIcon('power');
    }

    takeControl(player) {
        if(!this.inPlay || player.controller === this.controller || player.gold < 1) {
            return;
        }

        this.game.addMessage('{0} pays 1 gold to take control of {1}', player, this);

        player.gold--;

        this.game.takeControl(player, this);
    }
}

Bronn.code = '02089';

module.exports = Bronn;
