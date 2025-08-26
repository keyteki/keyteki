const Card = require('../../Card.js');

class CrypticCollapse extends Card {
    // Play: Discard your hand. For each card discarded this way, an enemy creature captures 1 from its own side.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: (() => {
                        const events = context.preThenEvents || [];
                        const cards = events.flatMap((e) =>
                            (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                        );
                        return cards.length || events.length;
                    })(),
                    action: ability.actions.capture({
                        promptForSelect: {
                            activePromptTitle: 'Choose a creature to capture 1 amber',
                            cardType: 'creature',
                            controller: 'opponent'
                        }
                    })
                }))
            }
        });
    }
}

CrypticCollapse.id = 'cryptic-collapse';

module.exports = CrypticCollapse;
