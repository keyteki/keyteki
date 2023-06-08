const Card = require('../../Card.js');

class MagistrateCrispus extends Card {
    // At the end of your turn, each player takes control of each
    // creature and artifact they own.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.sequentialCardLastingEffect((context) => ({
                forEach: context.game.cardsInPlay.filter(
                    (card) =>
                        (card.type === 'creature' || card.type === 'artifact') &&
                        card.controller !== card.owner
                ),
                duration: 'lastingEffect',
                effectForEach: context.game.cardsInPlay
                    .filter(
                        (card) =>
                            (card.type === 'creature' || card.type === 'artifact') &&
                            card.controller !== card.owner
                    )
                    .map((card) => ability.effects.takeControl(card.owner))
            }))
        });
    }
}

MagistrateCrispus.id = 'magistrate-crispus';

module.exports = MagistrateCrispus;
