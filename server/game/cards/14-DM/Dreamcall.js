const Card = require('../../Card.js');

class Dreamcall extends Card {
    // Play: Exhaust a creature. For each copy of Dreamcall in your discard pile, exhaust another creature and draw a card.
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
                    gameAction: ability.actions.sequentialForEach({
                        num: copies,
                        action: ability.actions.sequential([
                            ability.actions.exhaust({
                                promptForSelect: {
                                    cardType: 'creature',
                                    cardCondition: (card) => card !== preThenContext.target,
                                    activePromptTitle: 'Choose another creature to exhaust'
                                }
                            }),
                            ability.actions.draw((context) => ({
                                target: context.player
                            }))
                        ])
                    })
                };
            }
        });
    }
}

Dreamcall.id = 'dreamcall';

module.exports = Dreamcall;
