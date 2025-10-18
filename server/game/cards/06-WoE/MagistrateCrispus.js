const Card = require('../../Card.js');

class MagistrateCrispus extends Card {
    // At the end of your turn, each player takes control of each
    // creature and artifact they own.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (event, context) => context.player === this.game.activePlayer
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
            })),
            effect: 'return control of each creature and artifact to their owners'
        });
    }
}

MagistrateCrispus.id = 'magistrate-crispus';

module.exports = MagistrateCrispus;
