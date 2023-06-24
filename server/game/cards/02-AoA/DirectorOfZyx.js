const Card = require('../../Card.js');

class DirectorOfZyx extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // At the start of your turn, archive the top card of your deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck[0]
            }))
        });
    }
}

DirectorOfZyx.id = 'director-of-zyx';

module.exports = DirectorOfZyx;
