const Card = require('../../Card.js');

class PrimordialVault extends Card {
    // At the start of your turn, make a Cultist.
    //
    // Action: Destroy 4 friendly Cultists. If you do, search your
    // deck and discard pile for Tangaika, reveal it, add it to your
    // hand, and shuffle your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    context.player === this.game.activePlayer &&
                    !!context.player.tokenCard &&
                    context.player.tokenCard.name === 'Cultist'
            },
            gameAction: ability.actions.makeTokenCreature()
        });

        this.action({
            effectStyle: 'all',
            target: {
                mode: 'exactly',
                numCards: 4,
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.name === 'Cultist',
                gameAction: ability.actions.destroy()
            },
            then: {
                condition: (context) =>
                    context.preThenEvents.filter((event) => !event.cancelled).length >= 4,
                gameAction: ability.actions.search({
                    cardName: 'Tangaika',
                    amount: 1
                })
            }
        });
    }
}

PrimordialVault.id = 'primordial-vault';

module.exports = PrimordialVault;
