const Card = require('../../Card.js');

class GamblingDen extends Card {
    // At the start of each players turn, that player may choose a house. If they do, reveal the top card of their deck. If it is of the named house, they gain 2A. Otherwise, they lose 2A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (event) => event.player && event.player.deck.length > 0
            },
            useEventPlayer: true,
            optional: true,
            target: {
                mode: 'house',
                activePromptTitle: 'Gamble for amber?'
            },
            gameAction: ability.actions.reveal((context) => ({
                location: 'deck',
                target: context.event.player.deck[0]
            })),
            then: (preThenContext) => ({
                message: '{0} uses {1} to {3} 2 amber',
                messageArgs: (context) => [
                    context.preThenEvent.card.hasHouse(preThenContext.house) ? 'gain' : 'lose'
                ],
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvent.card.hasHouse(preThenContext.house) ? 2 : 0,
                        target: preThenContext.event.player
                    })),
                    ability.actions.loseAmber((context) => ({
                        amount: context.preThenEvent.card.hasHouse(preThenContext.house) ? 0 : 2,
                        target: preThenContext.event.player
                    }))
                ]
            })
        });
    }
}

GamblingDen.id = 'gambling-den';

module.exports = GamblingDen;
