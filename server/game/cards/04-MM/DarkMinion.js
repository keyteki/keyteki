const Card = require('../../Card.js');

class DarkMinion extends Card {
    // Enhance D. (These icons have already been added to cards in your deck.)
    // Destroyed: Deal 1D to each enemy creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player
                )
            }))
        });
    }
}

DarkMinion.id = 'dark-minion';

module.exports = DarkMinion;
