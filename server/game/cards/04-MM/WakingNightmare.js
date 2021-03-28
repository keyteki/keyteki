const Card = require('../../Card.js');

class WakingNightmare extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                "increase {1}'s key cost by 1 for each Dis creature in play until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(
                    () => this.game.creaturesInPlay.filter((card) => card.hasHouse('dis')).length
                )
            })
        });
    }
}

WakingNightmare.id = 'waking-nightmare';

module.exports = WakingNightmare;
