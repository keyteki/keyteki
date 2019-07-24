const Card = require('../../Card.js');

class RiggedLottery extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard(context => ({
                    target: context.player.deck.length > 0 ? context.player.deck.slice(0, Math.min(5, context.player.deck.length)) : []
                })),
                ability.actions.discard(context => ({
                    target: context.player.opponent.deck.length > 0 ? context.player.opponent.deck.slice(0, Math.min(5, context.player.opponent.deck.length)) : []
                }))
            ],
            then: preThenContext => {
                let myCards = preThenContext.player.deck.length > 0 ? preThenContext.player.deck.slice(0, Math.min(5, preThenContext.player.deck.length)) : [];
                let theirCards = preThenContext.player.opponent.deck.length > 0 ? preThenContext.player.opponent.deck.slice(0, Math.min(5, preThenContext.player.opponent.deck.length)) : [];
                return {
                    gameAction: [
                        ability.actions.gainAmber({
                            amount: myCards.filter(card => card.hasHouse('shadows')).length,
                            target: preThenContext.player
                        }),
                        ability.actions.gainAmber({
                            amount: theirCards.filter(card => card.hasHouse('shadows')).length,
                            target: preThenContext.player.opponent
                        })
                    ]
                };
            }
        });
    }
}

RiggedLottery.id = 'rigged-lottery';

module.exports = RiggedLottery;
