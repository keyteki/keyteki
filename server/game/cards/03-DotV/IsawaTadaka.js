const DrawCard = require('../../drawcard.js');

class IsawaTadaka extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: player => !this.game.rings.earth.isConsideredClaimed(player),
            effect: ability.effects.playerCannot({
                cannot: 'play',
                restricts: 'copiesOfDiscardEvents',
                source: this
            })
        });
    }
}

IsawaTadaka.id = 'isawa-tadaka';

module.exports = IsawaTadaka;
