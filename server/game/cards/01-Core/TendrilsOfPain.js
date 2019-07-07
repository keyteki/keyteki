const Card = require('../../Card.js');

class TendrilsOfPain extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal {1} damage to all creatures',
            effectArgs: context => context.player.opponent && context.player.opponent.keyForged ? 4 : 1,
            gameAction: ability.actions.dealDamage(context => ({
                amount: context.player.opponent && context.player.opponent.keyForged ? 4 : 1,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

TendrilsOfPain.id = 'tendrils-of-pain';

module.exports = TendrilsOfPain;
