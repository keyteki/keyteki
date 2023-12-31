const Card = require('../../Card.js');

class TendrilsFromBeyond extends Card {
    // Play: Choose a creature. If that creature’s controller is
    // haunted, return that creature and each of its neighbors to
    // their owner’s hand. Otherwise, return that creature to its
    // owner’s hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToHand((context) => ({
                    target:
                        context.target && context.target.controller.isHaunted()
                            ? [context.target].concat(context.target.neighbors)
                            : [context.target]
                }))
            }
        });
    }
}

TendrilsFromBeyond.id = 'tendrils-from-beyond';

module.exports = TendrilsFromBeyond;
