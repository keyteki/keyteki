const Card = require('../../Card.js');

class MartianPropagandist extends Card {
    // Play/After Reap: For the remainder of the turn, each of Martian Propagandist's neighbors belong to house Mars.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.untilPlayerTurnEnd((context) => ({
                targetController: 'any',
                match: (card) => context.source.neighbors.includes(card),
                effect: ability.effects.changeHouse('mars')
            })),
            effect: 'make its neighbors belong to house Mars for the remainder of the turn'
        });
    }
}

MartianPropagandist.id = 'martian-propagandist';

module.exports = MartianPropagandist;
