const Card = require('../../Card.js');

class LiviaTheElder extends Card {
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
