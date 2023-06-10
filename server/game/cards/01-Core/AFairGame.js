const Card = require('../../Card.js');

class AFairGame extends Card {
    // Play: Discard the top card of your opponents deck and reveal their hand. You gain 1A for each card of the discarded cards house revealed this way. Your opponent repeats the preceding effect on you.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                "discard the top card of {1}'s deck:{2} and reveal their hand: {3}, gaining {4} amber. Then {1} discards the top card of {5}'s deck: {6} and reveals their hand:{7}, gaining {8} amber",
            effectArgs: (context) => {
                let oppTop =
                    context.player.opponent.deck.length > 0 ? context.player.opponent.deck[0] : '';
                let oppHand = context.player.opponent.hand.map((card) => card).sort();
                let myTop = context.player.deck.length > 0 ? context.player.deck[0] : '';
                let myHand = context.player.hand.map((card) => card).sort();
                return [
                    context.player.opponent,
                    oppTop,
                    oppHand,
                    oppTop
                        ? oppHand.filter((card) => card.hasHouse(oppTop.printedHouse)).length
                        : 0,
                    context.player,
                    myTop,
                    myHand,
                    myTop ? myHand.filter((card) => card.hasHouse(myTop.printedHouse)).length : 0
                ];
            },
            gameAction: [
                ability.actions.discard(() => ({
                    target: this.game
                        .getPlayers()
                        .filter((player) => player.deck.length > 0)
                        .map((player) => player.deck[0])
                })),
                ability.actions.gainAmber((context) => {
                    let oppTop =
                        context.player.opponent.deck.length > 0
                            ? context.player.opponent.deck[0]
                            : '';
                    if (oppTop) {
                        return {
                            amount: context.player.opponent.hand.filter((card) =>
                                card.hasHouse(oppTop.printedHouse)
                            ).length
                        };
                    }

                    return { amount: 0 };
                }),
                ability.actions.gainAmber((context) => {
                    let myTop = context.player.deck.length > 0 ? context.player.deck[0] : '';
                    if (myTop) {
                        return {
                            target: context.player.opponent,
                            amount: context.player.hand.filter((card) =>
                                card.hasHouse(myTop.printedHouse)
                            ).length
                        };
                    }

                    return { amount: 0 };
                })
            ]
        });
    }
}

AFairGame.id = 'a-fair-game';

module.exports = AFairGame;
