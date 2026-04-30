const Card = require('../../Card.js');

class Dreamcall extends Card {
    // Play: Exhaust a creature. For each copy of Dreamcall in your discard pile,
    // exhaust another creature and draw a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => {
                const copies = preThenContext.player.discard.filter(
                    (card) => card.id === 'dreamcall'
                ).length;
                if (copies === 0) {
                    return { alwaysTriggers: true };
                }
                return {
                    alwaysTriggers: true,
                    target: {
                        cardType: 'creature',
                        cardCondition: (card) => card !== preThenContext.target,
                        mode: 'upTo',
                        numCards: copies,
                        activePromptTitle: 'Choose creatures to exhaust',
                        gameAction: ability.actions.exhaust()
                    },
                    gameAction: ability.actions.draw((context) => ({
                        target: context.player,
                        amount: copies
                    }))
                };
            }
        });
    }
}

Dreamcall.id = 'dreamcall';

module.exports = Dreamcall;
