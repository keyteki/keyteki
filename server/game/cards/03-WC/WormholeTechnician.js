const Card = require('../../Card.js');

class WormholeTechnician extends Card {
    // Reap: Reveal the top card of your deck. If it is a Logos card, play it. Otherwise, archive it.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.deck.length > 0,
            effect: 'reveal {1}{2}',
            effectArgs: (context) => {
                let card = context.player.deck[0];
                if (!card) {
                    return [];
                }
                let args = [card];
                if (card.hasHouse('logos')) {
                    return args.concat(', which is a Logos card, and play it');
                }

                return args.concat(', which is not a Logos card, so it gets archived');
            },
            gameAction: [
                ability.actions.playCard((context) => ({
                    revealOnIllegalTarget: true,
                    target:
                        context.player.deck[0] && context.player.deck[0].hasHouse('logos')
                            ? context.player.deck[0]
                            : []
                })),
                ability.actions.archive((context) => ({
                    target:
                        context.player.deck[0] && !context.player.deck[0].hasHouse('logos')
                            ? context.player.deck[0]
                            : []
                }))
            ]
        });
    }
}

WormholeTechnician.id = 'wormhole-technician';

module.exports = WormholeTechnician;
