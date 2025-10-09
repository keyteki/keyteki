const Card = require('../../Card.js');

class LoyaltyImplants extends Card {
    // Omni: Destroy Loyalty Implants. You may use friendly Mars
    // creatures this turn.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'destroy {0} and use friendly Mars creatures this turn',
            gameAction: [
                ability.actions.destroy(),
                ability.actions.untilEndOfPlayerTurn({
                    effect: ability.effects.canUse(
                        (card) => card.hasHouse('mars') && card.type === 'creature'
                    )
                })
            ]
        });
    }
}

LoyaltyImplants.id = 'loyalty-implants';

module.exports = LoyaltyImplants;
