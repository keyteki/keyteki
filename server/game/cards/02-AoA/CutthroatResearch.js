const Card = require('../../Card.js');

class CutthroatResearch extends Card {
    // Play: Steal 2A if your opponent has
    // 8A or more.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 8,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

CutthroatResearch.id = 'cutthroat-research';

module.exports = CutthroatResearch;
