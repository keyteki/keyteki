const DrawCard = require('../../drawcard.js');

class YogoOutcast extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isLessHonorableThanOpponent(),
            match: this,
            effect: [
                ability.effects.modifyMilitarySkill(1),
                ability.effects.modifyPoliticalSkill(1)
            ]
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

