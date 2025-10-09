const Card = require('../../Card.js');

class WakingNightmare extends Card {
    // Enhance PT. (These icons have already been added to cards in your deck.)
    // Play: Keys cost +1A for each Dis creature in play during your opponents next turn.
    setupCardAbilities(ability) {
        this.play({
            effect: "increase key cost by 1 for each Dis creature during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(
                    () => this.game.creaturesInPlay.filter((card) => card.hasHouse('dis')).length
                )
            })
        });
    }
}

WakingNightmare.id = 'waking-nightmare';

module.exports = WakingNightmare;
