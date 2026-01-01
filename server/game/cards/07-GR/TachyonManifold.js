const Card = require('../../Card.js');

class TachyonManifold extends Card {
    // Action: Take another turn after this one. Your opponent draws
    // 10 cards. Purge Tachyon Manifold.
    setupCardAbilities(ability) {
        this.action({
            effect: 'take another turn after this one and purge {0}',
            effectAlert: true,
            gameAction: [
                ability.actions.untilPlayerTurnEnd({
                    effect: ability.effects.anotherTurn(1)
                }),
                ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent,
                    trueGameAction: ability.actions.draw({
                        target: context.player.opponent,
                        amount: 10
                    })
                })),
                ability.actions.purge()
            ]
        });
    }
}

TachyonManifold.id = 'tachyon-manifold';

module.exports = TachyonManifold;
