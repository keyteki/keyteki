const Card = require('../../Card.js');

class RandomAccessArchives extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive(context => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

RandomAccessArchives.id = 'random-access-archives'; // This is a guess at what the id might be - please check it!!!

module.exports = RandomAccessArchives;
