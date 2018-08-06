const ProvinceCard = require('../../provincecard.js');

class TeachingsOfTheElements extends ProvinceCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyProvinceStrength(() => this.getNoOfClaimedRings())
        });
    }

    getNoOfClaimedRings() {
        let claimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed());
        return claimedRings.length;
    }
}

TeachingsOfTheElements.id = 'teachings-of-the-elements';

module.exports = TeachingsOfTheElements;
