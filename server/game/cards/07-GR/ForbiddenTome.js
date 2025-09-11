const Card = require('../../Card.js');

class ForbiddenTome extends Card {
    // Each haunted player refills their hand to 1 additional card
    // during their “draw cards” step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (player) => player.isHaunted(),
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

ForbiddenTome.id = 'forbidden-tome';

module.exports = ForbiddenTome;
