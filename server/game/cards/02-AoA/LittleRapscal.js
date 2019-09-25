const Card = require('../../Card.js');

class LittleRapscal extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: card => card.type === 'creature' && ability.actions.fight().canAffect(card, this.game.getFrameworkContext(card.controller)),
            effect: ability.effects.mustFightIfAble()
        });
    }
}

LittleRapscal.id = 'little-rapscal';

module.exports = LittleRapscal;
