const Card = require('../../Card.js');

class DeipnoSpymaster extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Omni: Choose a friendly creature. You may use that creature this turn.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.forRemainderOfTurn((context) => ({
                    effect: ability.effects.canUse((card) => card === context.target)
                }))
            },
            effect: 'allow {0} to be used for the remainder of the turn'
        });
    }
}

DeipnoSpymaster.id = 'deipno-spymaster';

module.exports = DeipnoSpymaster;
