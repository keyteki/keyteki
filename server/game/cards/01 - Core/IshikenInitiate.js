const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class IshikenInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getNoOfClaimedRings()),
                ability.effects.dynamicPoliticalSkill(() => this.getNoOfClaimedRings())
            ]
        });
    }
    
    getNoOfClaimedRings() {
        let claimedRings = _.size(this.controller.getClaimedRings());
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        if(otherPlayer) {
            claimedRings += _.size(otherPlayer.getClaimedRings());
        }
        return claimedRings;
    }
}

IshikenInitiate.id = 'ishiken-initiate';

module.exports = IshikenInitiate;
