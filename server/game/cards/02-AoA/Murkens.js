const Card = require('../../Card.js');

class Murkens extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
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
