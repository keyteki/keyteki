const Card = require('../../Card.js');

class CarpetPhloxem extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 4 damage to each creature.',
            condition: (context) => context.player.creaturesInPlay.length === 0,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 4,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

CarpetPhloxem.id = 'carpet-phloxem';

module.exports = CarpetPhloxem;
