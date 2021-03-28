const Card = require('../../Card.js');

class SigilOfBrotherhood extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse(
                        (card) => card.hasHouse('sanctum') && card.type === 'creature'
                    )
                })
            ]
        });
    }
}

SigilOfBrotherhood.id = 'sigil-of-brotherhood';

module.exports = SigilOfBrotherhood;
