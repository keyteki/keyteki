const Card = require('../../Card.js');

class Fidgit extends Card {
    // Elusive.
    // Reap: Discard a random card from your opponents archives or the top card of their deck. If that card is an action, play it as if it were yours.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                !!context.player.opponent &&
                (context.player.opponent.deck.length > 0 ||
                    context.player.opponent.archives.length > 0),
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': ability.actions.discard((context) => ({
                        target: context.player.opponent && context.player.opponent.deck[0]
                    })),
                    'Random card from archives': ability.actions.discardAtRandom((context) => ({
                        target: context.player.opponent,
                        location: 'archives'
                    }))
                }
            },
            then: {
                gameAction: ability.actions.playCard((context) => {
                    let card = context.preThenEvent.card;
                    if (!card) {
                        card = context.preThenEvent.cards && context.preThenEvent.cards[0];
                    }
                    return {
                        revealOnIllegalTarget: true,
                        target: card && card.type === 'action' ? card : []
                    };
                })
            }
        });
    }
}

Fidgit.id = 'fidgit';

module.exports = Fidgit;
