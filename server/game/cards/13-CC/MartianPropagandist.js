import Card from '../../Card.js';

class MartianPropagandist extends Card {
    // Play/After Reap: For the remainder of the turn, each of Martian Propagandist's neighbors belong to house Mars.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.cardLastingEffect((context) => ({
                effect: ability.effects.changeHouse('mars'),
                target: context.source.neighbors
            })),
            effect: 'make its neighbors belong to house Mars for the remainder of the turn'
        });
    }
}

MartianPropagandist.id = 'martian-propagandist';

export default MartianPropagandist;
