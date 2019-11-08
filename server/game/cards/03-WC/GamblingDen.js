const Card = require('../../Card.js');

class GamblingDen extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) => event.phase === 'key' && context.game.activePlayer && context.game.activePlayer.deck.length > 0
            },
            optional: true,
            target: {
                mode: 'house',
                activePromptTitle: 'Gamble for amber?'
            },
            effect: 'choose a house',
            gameAction: ability.actions.reveal(context => ({
                location: 'deck',
                chatMessage: true,
                target: context.game.activePlayer.deck[0]
            })),
            then: preThenContext => ({
                message: '{0} uses {1} to {3} 2 amber',
                messageArgs: context => [context.preThenEvent.card.hasHouse(preThenContext.house) ? 'gain' : 'lose'],
                gameAction: [
                    ability.actions.gainAmber(context => ({ amount : context.preThenEvent.card.hasHouse(preThenContext.house) ? 2 : 0, target: context.game.activePlayer })),
                    ability.actions.loseAmber(context => ({ amount : context.preThenEvent.card.hasHouse(preThenContext.house) ? 0 : 2, target: context.game.activePlayer }))
                ]
            })
        });
    }
}

GamblingDen.id = 'gambling-den';

module.exports = GamblingDen;
