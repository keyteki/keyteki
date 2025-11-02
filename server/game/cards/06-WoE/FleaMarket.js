fconst _ = require('underscore');
const Card = require('../../Card.js');

class FleaMarket extends Card {
    // Action: Look at a random card in your opponent's hand. You may give your opponent 1 Aember. If you do, play that card as if it were yours.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.opponent,
            effect: "reveal a random card from {1}'s hand and optionally pay 1 amber to play it",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.reveal((context) => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(context.player.opponent.hand)[0]
            })),
            then: (
                preThenContext,
                revealedCard = preThenContext.ability.gameAction[0].target[0]
            ) => ({
                may: 'pay opponent one amber to play this card',
                condition: (context) => {
                    return context.player.amber >= 1;
                },
                gameAction: ability.actions.sequential([
                    ability.actions.transferAmber((context) => ({
                        target: context.player,
                        amount: 1
                    })),
                    ability.actions.playCard({
                        target: revealedCard
                    })
                ])
            })
        });
    }
}

FleaMarket.id = 'flea-market';

module.exports = FleaMarket;
