const Card = require('../../Card.js');

class GroundbreakingDiscovery extends Card {
    // Play: If you control "Doctor Verokter", "Roof Laboratory", and "Reckless Experiment",
    // destroy each card in play, unforge an opponent's key and purge Groundbreaking Discovery.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.some((card) => card.name === 'Doctor Verokter?') &&
                context.player.cardsInPlay.some((card) => card.name === 'Roof Laboratory?') &&
                context.player.creaturesInPlay.some((card) =>
                    card.upgrades.some((upgrade) => upgrade.name === 'Reckless Experiment ?')
                ),
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay
                })),
                ability.actions.unforgeKey(),
                ability.actions.purge()
            ]),
            effect: "destroy each card in play, unforge an opponent's key and purge {0}"
        });
    }
}

GroundbreakingDiscovery.id = 'groundbreaking-discovery';

module.exports = GroundbreakingDiscovery;
