const DrawCard = require('../../../drawcard.js');

class Bronn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to take control of Bronn',
            method: 'takeControl',
            phase: 'marshal',
            anyPlayer: true
        });
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.defendingPlayer === this.controller,
            match: this,
            effect: [
                ability.effects.addIcon('military'),
                ability.effects.addIcon('intrigue'),
                ability.effects.addIcon('power')
            ]
        });
    }

    takeControl(player) {
        if(player === this.controller || player.gold < 1) {
            return false;
        }

        this.game.addMessage('{0} pays 1 gold to take control of {1}', player, this);

        this.game.addGold(player, -1);
        this.game.takeControl(player, this);
    }
}

Bronn.code = '02089';

module.exports = Bronn;
