const Card = require('../../Card.js');

class WhistlingDarts extends Card {
    // Play: Deal 1D to each enemy creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to each enemy creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player
                )
            }))
        });
    }
}

WhistlingDarts.id = 'whistling-darts';

module.exports = WhistlingDarts;
