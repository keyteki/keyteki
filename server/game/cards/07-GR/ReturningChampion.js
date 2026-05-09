const Card = require('../../Card.js');

class ReturningChampion extends Card {
    // Play: Deal 3 to Returning Champion.
    //
    // After Fight: If you are haunted, move all damage from Returning
    // Champion to another creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.source,
                amount: 3
            }))
        });

        this.fight({
            condition: (context) =>
                context.source.controller.isHaunted() && context.source.hasToken('damage'),
            target: {
                activePromptTitle: 'Choose a creature to move damage to',
                cardCondition: (card, context) => card !== context.source,
                cardType: 'creature',
                gameAction: [
                    ability.actions.addDamageToken((context) => ({
                        target: context.target,
                        amount: context.source.damage
                    })),
                    ability.actions.removeDamage((context) => ({
                        target: context.source,
                        amount: context.source.damage
                    }))
                ]
            }
        });
    }
}

ReturningChampion.id = 'returning-champion';

module.exports = ReturningChampion;
