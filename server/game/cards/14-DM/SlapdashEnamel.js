const Card = require('../../Card.js');

class SlapdashEnamel extends Card {
    // At the start of your turn, destroy each card with a corrosion counter on it.
    // Action: Put a corrosion counter on a card in play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.cardsInPlay
                    .filter((card) => card.hasToken('corrosion'))
                    .concat(
                        context.game.cardsInPlay.flatMap((card) =>
                            (card.upgrades || []).filter((upgrade) => upgrade.hasToken('corrosion'))
                        )
                    )
            }))
        });

        this.action({
            target: {
                cardType: ['creature', 'artifact', 'upgrade'],
                location: 'play area',
                gameAction: ability.actions.addCorrosionCounter()
            }
        });
    }
}

SlapdashEnamel.id = 'slapdash-enamel';

module.exports = SlapdashEnamel;
