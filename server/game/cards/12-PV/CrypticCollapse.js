const Card = require('../../Card.js');

class CrypticCollapse extends Card {
    // Play: Discard your hand. For each card discarded this way, an enemy creature captures 1 from its own side.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discardEntireLocation((context) => ({
                location: 'hand',
                target: context.player
            })),
            then: {
                gameAction: ability.actions.allocateCapture((context) => ({
                    numAmber: context.preThenCards.length,
                    controller: 'opponent',
                    player: context.player.opponent,
                    menuTitle: 'Choose a creature to capture 1 amber'
                }))
            }
        });
    }
}

CrypticCollapse.id = 'cryptic-collapse';

module.exports = CrypticCollapse;
