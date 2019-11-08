const Card = require('../../Card.js');

class ChainGang extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.name === 'Subtle Chain' &&
                    event.player === context.player && event.card !== context.source
            },
            gameAction: ability.actions.ready()
        });
        this.action({
            target: {
                cardType: 'action',
                location: ['discard'],
                controller: 'self',
                cardCondition: card => card.name === 'Subtle Chain',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            },
            gameAction: ability.actions.steal()
        });
    }
}

ChainGang.id = 'chain-gang';

module.exports = ChainGang;
