const Card = require('../../Card.js');

class BypassBurglar extends Card {
    // Entrench.
    // While Bypass Burglar is exhausted, each of its neighbors gains, "Action:
    // Steal 1A. Deal 1D to this creature."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.sequential([
                    ability.actions.steal(),
                    ability.actions.dealDamage((context) => ({
                        target: context.source
                    }))
                ]),
                effect: 'steal 1 amber and deal 1 damage to {0}',
                effectArgs: (context) => [context.source]
            })
        });
    }
}

BypassBurglar.id = 'bypass-burglar';

module.exports = BypassBurglar;
