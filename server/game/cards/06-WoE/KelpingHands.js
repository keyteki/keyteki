const Card = require('../../Card.js');

class KelpingHands extends Card {
    //Omni: Destroy Kelping Hands. For the remainder of the turn, each friendly creature gains poison.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.source
                })),
                ability.actions.forRemainderOfTurn({
                    match: (card) => card.type === 'creature',
                    effect: ability.effects.addKeyword({
                        poison: 1
                    })
                })
            ]),
            effect:
                'destroy {0}. For the remainder of the turn, each friendly creature gains poison',
            effectAlert: true
        });
    }
}

KelpingHands.id = 'kelping-hands';

module.exports = KelpingHands;
