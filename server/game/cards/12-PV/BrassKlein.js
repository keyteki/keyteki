const Card = require('../../Card.js');

class BrassKlein extends Card {
    // While on a flank, Brass Klein gains skirmish.
    // While not on a flank, Brass Klein gains taunt.
    // Fate: For the remainder of the turn, friendly creatures cannot fight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.persistentEffect({
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ taunt: 1 })
        });

        this.fate({
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('fight')
            })
        });
    }
}

BrassKlein.id = 'brass-klein';

module.exports = BrassKlein;
