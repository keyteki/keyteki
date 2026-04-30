const Card = require('../../Card.js');

class DapperChapeau extends Card {
    // This creature gains, "Action: Deal 4 to a creature. If this damage
    // destroys that creature, return Dapper Chapeau to its owner's hand.
    // Otherwise, attach Dapper Chapeau to that creature."
    setupCardAbilities(ability) {
        const upgrade = this;
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 4 })
                },
                then: (preThenContext) => {
                    const targetCard = preThenContext.target;
                    return {
                        alwaysTriggers: true,
                        gameAction: ability.actions.conditional({
                            // Damage destroyed the target -> return DC to hand.
                            condition: (context) =>
                                !!(
                                    context.preThenEvent &&
                                    context.preThenEvent.destroyEvent &&
                                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                                    context.preThenEvent.destroyEvent.resolved
                                ),
                            trueGameAction: ability.actions.returnToHand({
                                target: upgrade,
                                location: ['play area', 'discard']
                            }),
                            falseGameAction: ability.actions.conditional({
                                // Both target and host are still alive ->
                                // attach DC to the target.
                                condition: () =>
                                    upgrade.location === 'play area' &&
                                    !!targetCard &&
                                    targetCard.location === 'play area',
                                trueGameAction: ability.actions.attach({
                                    target: targetCard,
                                    upgrade: upgrade
                                }),
                                falseGameAction: ability.actions.conditional({
                                    // Host died as collateral but target
                                    // survived -> return DC to hand from
                                    // discard. Otherwise (target also gone)
                                    // DC stays in the discard.
                                    condition: () =>
                                        upgrade.location === 'discard' &&
                                        !!targetCard &&
                                        targetCard.location === 'play area',
                                    trueGameAction: ability.actions.returnToHand({
                                        target: upgrade,
                                        location: ['play area', 'discard']
                                    }),
                                    falseGameAction: []
                                })
                            })
                        })
                    };
                }
            })
        });
    }
}

DapperChapeau.id = 'dapper-chapeau';

module.exports = DapperChapeau;
