const Card = require('../../Card.js');

class Plummet extends Card {
    // Play: Discard your hand. Deal 1 to each creature for each card
    // discarded this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay,
                    amount: (() => {
                        const events = context.preThenEvents || [];
                        const cards = events.flatMap((e) =>
                            (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                        );
                        return cards.length || events.length;
                    })()
                })),
                message: '{0} uses {1} to deal {3} damage to each creature',
                messageArgs: (context) => [
                    (() => {
                        const events = context.preThenEvents || [];
                        const cards = events.flatMap((e) =>
                            (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                        );
                        return cards.length || events.length;
                    })()
                ]
            }
        });
    }
}

Plummet.id = 'plummet';

module.exports = Plummet;
