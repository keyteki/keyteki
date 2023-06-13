const Card = require('../../Card.js');

class Murkens extends Card {
    // Play: Choose a random card in your opponents archives or the top card of your opponents deck. Play that card as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                (context.player.opponent.deck.length > 0 ||
                    context.player.opponent.archives.length > 0),
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': ability.actions.playCard((context) => ({
                        revealOnIllegalTarget: true,
                        target: context.player.opponent.deck[0]
                    })),
                    'Random card from archives': ability.actions.playAtRandom((context) => ({
                        location: 'archives',
                        revealOnIllegalTarget: true,
                        target: context.player.opponent
                    }))
                }
            }
        });
    }
}

Murkens.id = 'murkens';

module.exports = Murkens;
