const Card = require('../../Card.js');

class TribunePompitus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.modifyPower(target => 2 * target.amber)
        });

        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            optional: true,
            gameAction: ability.actions.exalt()
        });
    }
}

TribunePompitus.id = 'tribune-pompitus';

module.exports = TribunePompitus;
