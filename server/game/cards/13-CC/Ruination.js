const Card = require('../../Card.js');

class Ruination extends Card {
    // Play: Choose a card. Destroy that card and each card with the same name.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: ['creature', 'artifact', 'upgrade'],
                location: 'play area',
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay
                        .filter((card) => card.name === context.target.name)
                        .concat(
                            context.game.cardsInPlay
                                .flatMap((card) => card.upgrades || [])
                                .filter((upgrade) => upgrade.name === context.target.name)
                        )
                }))
            },
            effect: 'destroy {1} and each card with the same name',
            effectArgs: (context) => [context.target]
        });
    }
}

Ruination.id = 'ruination';

module.exports = Ruination;
