const Card = require('../../Card.js');

class MissChievous extends Card {
    // After a friendly Geistoid creature enters play, each player
    // discards the top 2 cards of their deck.
    //
    // After Reap: Play the topmost creature from your discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    context.player === event.player &&
                    event.card.type === 'creature' &&
                    event.card.hasHouse('geistoid')
            },

            gameAction: ability.actions.discard(() => ({
                target: this.game
                    .getPlayers()
                    .flatMap((player) => player.deck.slice(0, Math.min(2, player.deck.length)))
            })),
            preferActionPromptMessage: true
        });

        this.reap({
            gameAction: ability.actions.playCard((context) => ({
                target: context.player.discard.find((c) => c.type === 'creature')
            }))
        });
    }
}

MissChievous.id = 'miss-chievous';

module.exports = MissChievous;
