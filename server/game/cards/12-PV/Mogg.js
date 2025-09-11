const Card = require('../../Card.js');

class Mogg extends Card {
    // Play: Deal 4 damage to each creature with power 5 or higher.
    // Fate: Stun each friendly creature with power 5 or higher.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 4 damage to each creature with power 5 or higher',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 4,
                target: context.game.creaturesInPlay.filter((card) => card.power >= 5)
            }))
        });

        this.fate({
            effect: 'stun each friendly creature with power 5 or higher',
            gameAction: ability.actions.stun((context) => ({
                target: context.game.activePlayer.creaturesInPlay.filter((card) => card.power >= 5)
            }))
        });
    }
}

Mogg.id = 'mogg';

module.exports = Mogg;
