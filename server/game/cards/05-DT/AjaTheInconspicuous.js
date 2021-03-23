const Card = require('../../Card.js');

class AjaTheInconspicuous extends Card {
    //While $this is not on a flank, it cannot be dealt damage.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.cardCannot('damage')
        });
    }
}

AjaTheInconspicuous.id = 'aja-the-inconspicuous';

module.exports = AjaTheInconspicuous;
