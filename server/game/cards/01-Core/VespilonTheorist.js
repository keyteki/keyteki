const Card = require('../../Card.js');

class VespilonTheorist extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.deck.length > 0,
            target: {
                mode: 'house'
            },
            effect: 'choose {1}, reveal {2}{3} and {4}',
            effectArgs: (context) => {
                let card = context.player.deck[0];
                let args = [context.house, card];
                if (card.hasHouse(context.house)) {
                    return args.concat(', archive it', 'gain 1 amber');
                }

                return args.concat('', 'discard it');
            },
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.player.deck[0].hasHouse(context.house)
                        ? []
                        : context.player.deck[0]
                })),
                ability.actions.archive((context) => ({
                    target: context.player.deck[0].hasHouse(context.house)
                        ? context.player.deck[0]
                        : []
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.deck[0].hasHouse(context.house) ? 1 : 0
                }))
            ]
        });
    }
}

VespilonTheorist.id = 'vespilon-theorist';

module.exports = VespilonTheorist;
