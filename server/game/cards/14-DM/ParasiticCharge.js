const Card = require('../../Card.js');

class ParasiticCharge extends Card {
    // Play: Forge a key at +8A current cost, reduced by 1A for each amber in your opponent's pool. If you do, purge Parasitic Charge.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: 8 - (context.player.opponent ? context.player.opponent.amber : 0),
                modifyCurrentKeyCost: true
            })),
            then: {
                condition: (context) => context.preThenEvent && !context.preThenEvent.cancelled,
                gameAction: ability.actions.purge((context) => ({ target: context.source }))
            },
            effect: 'forge a key'
        });
    }
}

ParasiticCharge.id = 'parasitic-charge';

module.exports = ParasiticCharge;
