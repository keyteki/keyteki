import Card from '../../Card.js';

class GroundbreakingDiscovery extends Card {
    // Play: If you control Dr. Verokter, Rooftop Laboratory, and Reckless Experimentation, destroy each card in play, unforge an opponent’s key, and purge Groundbreaking Discovery.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.some((card) => card.name === 'Dr. Verokter') &&
                context.player.cardsInPlay.some((card) => card.name === 'Rooftop Laboratory') &&
                context.player.creaturesInPlay.some((card) =>
                    card.upgrades.some((upgrade) => upgrade.name === 'Reckless Experimentation')
                ),
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay.reduce(
                        (cardsAndUpgrades, card) => [card, ...card.upgrades, ...cardsAndUpgrades],
                        []
                    )
                })),
                ability.actions.unforgeKey(),
                ability.actions.purge()
            ]),
            effect: "destroy each card in play, unforge an opponent's key and purge {0}"
        });
    }
}

GroundbreakingDiscovery.id = 'groundbreaking-discovery';

export default GroundbreakingDiscovery;
