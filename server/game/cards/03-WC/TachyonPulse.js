const Card = require('../../Card.js');

class TachyonPulse extends Card {
    // Play: Destroy each artifact. Exhaust each creature with an upgrade.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay.filter((card) => card.type === 'artifact')
                })),
                ability.actions.exhaust((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.upgrades.length > 0)
                }))
            ]
        });
    }
}

TachyonPulse.id = 'tachyon-pulse';

module.exports = TachyonPulse;
