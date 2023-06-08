const Card = require('../../Card.js');

class MagistrateCrispus extends Card {
    // At the end of your turn, each player takes control of each
    // creature and artifact they own.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: [
                ability.actions.sequentialCardLastingEffect((context) => ({
                    forEach: context.game.cardsInPlay.filter(
                        (card) =>
                            (card.type === 'creature' || card.type === 'artifact') &&
                            card.controller !== card.owner &&
                            card.owner === context.game.activePlayer
                    ),
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer)
                })),
                ability.actions.sequentialCardLastingEffect((context) => ({
                    forEach: context.game.cardsInPlay.filter(
                        (card) =>
                            (card.type === 'creature' || card.type === 'artifact') &&
                            card.controller !== card.owner &&
                            card.owner === context.game.activePlayer.opponent
                    ),
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer.opponent)
                }))
            ]
        });
    }
}

MagistrateCrispus.id = 'magistrate-crispus';

module.exports = MagistrateCrispus;
