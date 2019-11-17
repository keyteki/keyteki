const Card = require('../../Card.js');

class AFairGame extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            message: {
                format: 'discard the top card of {opponent}\'s deck:{oppTop} and reveal their hand: {oppHand}, gaining {myAmber} amber. Then {opponent} discards the top card of {player}\'s deck: {myTop} and reveals their hand:{myHand}, gaining {oppAmber} amber',
                args: {
                    oppTop: context => context.player.opponent.deck.length > 0 ? context.player.opponent.deck[0] : '',
                    oppHand: context => context.player.opponent.hand.map(card => card).sort(),
                    myAmber: context => context.player.opponent.deck.length > 0 ? context.player.opponent.hand.filter(card => card.hasHouse(context.player.opponent.deck[0].printedHouse)).length : 0,
                    myTop: context => context.player.deck.length > 0 ? context.player.deck[0] : '',
                    myHand: context => context.player.hand.map(card => card).sort(),
                    oppAmber: context => context.player.deck.length > 0 ? context.player.hand.filter(card => card.hasHouse(context.player.deck[0].printedHouse)).length : 0
                }
            },
            gameAction: [
                ability.actions.discard(() => ({ target: this.game.getPlayers().filter(player => player.deck.length > 0).map(player => player.deck[0]) })),
                ability.actions.gainAmber(context => {
                    let oppTop = context.player.opponent.deck.length > 0 ? context.player.opponent.deck[0] : '';
                    if(oppTop) {
                        return {
                            amount: context.player.opponent.hand.filter(card => card.hasHouse(oppTop.printedHouse)).length
                        };
                    }

                    return { amount: 0 };
                }),
                ability.actions.gainAmber(context => {
                    let myTop = context.player.deck.length > 0 ? context.player.deck[0] : '';
                    if(myTop) {
                        return {
                            target: context.player.opponent,
                            amount: context.player.hand.filter(card => card.hasHouse(myTop.printedHouse)).length
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
