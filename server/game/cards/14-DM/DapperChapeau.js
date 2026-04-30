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
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.conditional((context) => ({
                        condition: !!(
                            context.preThenEvent &&
                            context.preThenEvent.destroyEvent &&
                            context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                            context.preThenEvent.destroyEvent.resolved
                        ),
                        trueGameAction: ability.actions.returnToHand({
                            target: upgrade
                        }),
                        falseGameAction: ability.actions.attach({
                            target: context.preThenEvent ? context.preThenEvent.card : undefined,
                            upgrade: upgrade
                        })
                    }))
                }
            })
        });
    }
}

DapperChapeau.id = 'dapper-chapeau';

module.exports = DapperChapeau;
