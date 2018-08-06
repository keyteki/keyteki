const DrawCard = require('../../drawcard.js');

class KitsuWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.modifyMilitarySkill(() => this.twiceMilClaimedRings()),
                ability.effects.modifyPoliticalSkill(() => this.twicePolClaimedRings())
            ]
        });
    }

    twiceMilClaimedRings() {
        let milclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() & ring.isConflictType('military'));
        return 2 * milclaimedRings.length;
    }
    twicePolClaimedRings() {
        let polclaimedRings = Object.values(this.game.rings).filter(ring => ring.isConsideredClaimed() & ring.isConflictType('political'));
        return 2 * polclaimedRings.length;
    }
}

KitsuWarrior.id = 'kitsu-warrior';

module.exports = KitsuWarrior;
