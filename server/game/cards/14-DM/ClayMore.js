const Card = require('../../Card.js');

class ClayMore extends Card {
    // Destroyed: Deal 2 damage to each enemy flank creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player && card.isOnFlank()
                )
            }))
        });
    }
}

ClayMore.id = 'clay-more';

module.exports = ClayMore;
