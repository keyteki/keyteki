const Card = require('../../Card.js');

class RandomAccessArchives extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

RandomAccessArchives.id = 'random-access-archives';

module.exports = RandomAccessArchives;
