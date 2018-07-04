const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class TeachingsOfTheElements extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyProvinceStrength(() => this.getNoOfClaimedRings())
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

TeachingsOfTheElements.id = 'teachings-of-the-elements';

module.exports = TeachingsOfTheElements;
