const Card = require('../../Card.js');

class TendrilsOfPain extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage {1}to all creatures',
            effectArgs: context => context.player.opponent && context.player.opponent.keyForged ?
                context.player.opponent.keyForged.length > 0 ? ', then an additional 3 damage, ' : '' : '',
            gameAction: ability.actions.sequential([
                ability.actions.dealDamage(context => ({
                    amount: 1,
                    target: context.game.creaturesInPlay
                })),
                ability.actions.conditional({
                    condition: context => context.player.opponent && context.player.opponent.keyForged.length > 0,
                    trueGameAction: ability.actions.dealDamage(context => ({
                        amount: 3,
                        target: context.game.creaturesInPlay
                    }))
                })
            ])
        });
    }
}

TendrilsOfPain.id = 'tendrils-of-pain';

module.exports = TendrilsOfPain;
