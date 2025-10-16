const Card = require('../../Card.js');

class ImprovisedAviation extends Card {
    // Play: The next creature you play this turn enters play
    // ready. Until the end of your turn it gains, ”After Fight:
    // Shuffle an artifact from play into its owner’s deck.
    setupCardAbilities(ability) {
        this.play({
            effect: 'have the next friendly creature enter play ready and gain a fight effect',
            gameAction: [
                ability.actions.lastingEffect({
                    until: {
                        onCardEntersPlay: (event) =>
                            event.card.type === 'creature' &&
                            event.context.game.activePlayer === event.card.controller,
                        onRoundEnded: () => true
                    },
                    multipleTrigger: false,
                    effect: [
                        ability.effects.entersPlayReady(),
                        // This is tricky because we need the granted ability
                        // to persist after the entersPlayReady effect expires
                        // (which happens on the first `onCardEntersPlay` event),
                        // so we need to grant the effect to the card while it
                        // is entering play, and let it last for the rest of
                        // the round.
                        ability.effects.entersPlayWithEffect({
                            duration: 'untilEndOfRound',
                            builder: () =>
                                ability.effects.gainAbility('fight', {
                                    target: {
                                        cardType: 'artifact',
                                        controller: 'any',
                                        gameAction: ability.actions.returnToDeck((context) => ({
                                            shufflePlayer: context.target.owner,
                                            shuffle: true
                                        }))
                                    }
                                })
                        })
                    ]
                })
            ]
        });
    }
}

ImprovisedAviation.id = 'improvised-aviation';

module.exports = ImprovisedAviation;
