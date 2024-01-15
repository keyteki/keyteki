const Card = require('../../Card.js');

class SoulBomb extends Card {
    // Omni: If you are haunted, deal 4 to each creature. Destroy Soul Bomb.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sequential([
                ability.actions.dealDamage((context) => ({
                    amount: context.player.isHaunted() ? 4 : 0,
                    target: context.game.creaturesInPlay
                })),
                ability.actions.destroy()
            ])
        });
    }
}

SoulBomb.id = 'soul-bomb';

module.exports = SoulBomb;
