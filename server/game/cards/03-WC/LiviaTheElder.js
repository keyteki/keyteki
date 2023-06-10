const Card = require('../../Card.js');

class LiviaTheElder extends Card {
    // Reap: You may exalt Livia the Elder. If you do, each friendly creatures fight effects and reap effects are fight/reap effects for the remainder of the turn.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.forRemainderOfTurn({
                    effect: [
                        ability.effects.reapAbilitiesAddFight(),
                        ability.effects.fightAbilitiesAddReap()
                    ]
                })
            }
        });
    }
}

LiviaTheElder.id = 'livia-the-elder';

module.exports = LiviaTheElder;
