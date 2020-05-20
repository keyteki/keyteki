const Card = require('../../Card.js');

class TribunePompitus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: () => true,
            effect: ability.effects.modifyPower((target) => 2 * target.amber)
        });

        this.beforeFight({
            optional: true,
            gameAction: ability.actions.exalt()
        });
    }
}

TribunePompitus.id = 'tribune-pompitus';

module.exports = TribunePompitus;
