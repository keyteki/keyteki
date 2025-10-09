const Card = require('../../Card.js');

class SV3Lander extends Card {
    // Play: Make a token creature.
    //
    // Omni: Destroy SV3 Lander. For the remainder of the turn, you
    // may use friendly token creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse(
                        (card) => card.type === 'creature' && card.isToken()
                    )
                })
            ]
        });
    }
}

SV3Lander.id = 'sv3-lander';

module.exports = SV3Lander;
