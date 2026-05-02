const Card = require('../../Card.js');

class HotBunk extends Card {
    // Play: Exhaust a creature. If you do, ready a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.ready()
                }
            }
        });
    }
}

HotBunk.id = 'hot-bunk';

module.exports = HotBunk;
