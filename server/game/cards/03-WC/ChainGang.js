const Card = require('../../Card.js');

class ChainGang extends Card {
    // After you play Subtle Chain, ready Chain Gang.
    // Action: Steal 1A. Shuffle a Subtle Chain from your discard pile into your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.name === 'Subtle Chain' &&
                    event.player === context.player &&
                    event.card !== context.source
            },
            gameAction: ability.actions.ready()
        });
        this.action({
            target: {
                cardType: 'action',
                location: ['discard'],
                controller: 'self',
                cardCondition: (card) => card.name === 'Subtle Chain',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            },
            gameAction: ability.actions.steal()
        });
    }
}

ChainGang.id = 'chain-gang';

module.exports = ChainGang;
