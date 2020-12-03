const Card = require('../../Card.js');

class Murkens extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'select',
                choices: {
                    'Top of deck': ability.actions.playCard((context) => ({
                        target: context.player.opponent.deck[0],
                        revealOnIllegalTarget: true,
                        revealOnIllegalTargetMessage:
                            "{0} keeps {2} at the top of their opponent's deck"
                    })),
                    'Random card from archives': ability.actions.playAtRandom((context) => ({
                        location: 'archives',
                        revealOnIllegalTarget: true,
                        revealOnIllegalTargetMessage: "{0} keeps {2} at their opponent's archive",
                        target: context.player.opponent
                    }))
                }
            }
        });
    }
}

Murkens.id = 'murkens';

module.exports = Murkens;
