const Card = require('../../Card.js');

class DarkMinion extends Card {
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
