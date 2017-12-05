const DrawCard = require('../../drawcard.js');

class AgashaSumiko extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => (
                this.controller.imperialFavor !== '' &&
                this.isAttacking()
            ),
            effect: ability.effects.doesNotBowAsAttacker()
        });
    }
}

AgashaSumiko.id = 'agasha-sumiko';

module.exports = AgashaSumiko;
