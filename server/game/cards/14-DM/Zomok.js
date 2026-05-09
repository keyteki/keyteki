const GiganticCard = require('../../GiganticCard.js');

class Zomok extends GiganticCard {
    // (Play only with the other half of Zomok.)
    // While Zomok is attacking, ignore taunt, elusive, poison, hazardous, and invulnerable.
    // After Fight: Deal 2 damage to a creature for each forged key.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            effect: [
                ability.effects.ignores('taunt'),
                ability.effects.ignores('elusive'),
                ability.effects.ignores('poison'),
                ability.effects.ignores('hazardous'),
                ability.effects.ignores('invulnerable')
            ]
        });

        this.fight({
            condition: (context) =>
                context.player.getForgedKeys() +
                    (context.player.opponent ? context.player.opponent.getForgedKeys() : 0) >
                0,
            effect: 'deal 2 damage to a creature for each forged key',
            gameAction: ability.actions.allocateDamage((context) => ({
                damageStep: 2,
                numSteps:
                    context.player.getForgedKeys() +
                    (context.player.opponent ? context.player.opponent.getForgedKeys() : 0)
            }))
        });
    }
}

Zomok.id = 'zomok';

module.exports = Zomok;
