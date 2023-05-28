const _ = require('underscore');
const Card = require('../../Card.js');

class FleaMarket extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: "reveal a random card from {1}'s hand",
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
                may: 'lose one amber to play this card',
                condition: (context) => {
                    return context.player.amber >= 1;
                },
                gameAction: ability.actions.sequential([
                    ability.actions.loseAmber((context) => ({
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
