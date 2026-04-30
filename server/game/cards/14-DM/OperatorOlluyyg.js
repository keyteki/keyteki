const Card = require('../../Card.js');

class OperatorOlluyyg extends Card {
    // Entrench.
    // While Operator Olluyyg is exhausted, your opponent's keys cost +3A more to forge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost((_, context) =>
                context.source.exhausted ? 3 : 0
            )
        });
    }
}

OperatorOlluyyg.id = 'operator-olluyyg';

module.exports = OperatorOlluyyg;
