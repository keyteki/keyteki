const Card = require('../../Card.js');

class TheMist extends Card {
    // Omni: Destroy The Mist. For the remainder of the turn, each creature gains the Mutant trait.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.destroy(),
                ability.actions.untilEndOfPlayerTurn({
                    targetController: 'any',
                    effect: ability.effects.addTrait('mutant')
                })
            ],
            effect:
                'destroy {0} and make each creature gain the Mutant trait for the remainder of the turn',
            effectArgs: (context) => context.source
        });
    }
}

TheMist.id = 'the-mist';

module.exports = TheMist;
