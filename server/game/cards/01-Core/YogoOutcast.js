const DrawCard = require('../../drawcard.js');

class YogoOutcast extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isLessHonorableThanOpponent(),
            match: this,
            effect: ability.effects.modifyBothSkills(1)
        });
    }
    
    isLessHonorableThanOpponent() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        if(otherPlayer && otherPlayer.honor > this.controller.honor) {
            return true;
        }
        return false;
    }
}

YogoOutcast.id = 'yogo-outcast';

module.exports = YogoOutcast;

