const Costs = {
    exhaust: () => ({
        canPay: context => !context.source.exhausted,
        payEvent: context => context.game.actions.exhaust().getEvent(context.source, context)
    }),
    use: () => ({
        canPay: context => context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length < 6,
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => context.game.cardsUsed.push(context.source))
    }),
    play: () => ({
        canPay: context => context.game.cardsUsed.concat(context.game.cardsPlayed).filter(card => card.name === context.source.name).length < 6,
        payEvent: context => context.game.getEvent('unnamedEvent', {}, () => context.game.cardsPlayed.push(context.source))
    }),
    payAmber: (amount = 1) => ({
        canPlay: context => context.player.amber >= amount,
        payEvent: context => context.game.actions.giveAmber({ amount: amount }).getEvent(context.player.opponent, context)
    }),
    loseAmber: (amount = 1) => ({
        canPlay: context => context.player.amber >= amount,
        payEvent: context => context.game.actions.loseAmber({ amount: amount }).getEvent(context.player, context)
    })
};

module.exports = Costs;
