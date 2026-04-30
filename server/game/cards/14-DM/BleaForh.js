const Card = require('../../Card.js');

class BleaForh extends Card {
    // After Fight: Heal up to 2 damage from a creature. For each damage
    // healed this way, exalt that creature.
    setupCardAbilities(ability) {
        this.fight({
            targets: {
                creature: {
                    activePromptTitle: 'Choose a creature to heal',
                    cardType: 'creature'
                },
                amount: {
                    dependsOn: 'creature',
                    mode: 'select',
                    activePromptTitle: 'Choose how much damage to heal',
                    choices: {
                        0: () => true,
                        1: (context) =>
                            context.targets.creature && context.targets.creature.damage >= 1,
                        2: (context) =>
                            context.targets.creature && context.targets.creature.damage >= 2
                    }
                }
            },
            effect: 'heal {1} for {2} damage',
            effectArgs: (context) => [context.targets.creature, context.selects.amount.choice],
            gameAction: [
                ability.actions.heal((context) => ({
                    target: context.targets.creature,
                    amount:
                        context.selects && context.selects.amount
                            ? parseInt(context.selects.amount.choice)
                            : 0
                })),
                ability.actions.exalt((context) => ({
                    target: context.targets.creature,
                    amount:
                        context.selects && context.selects.amount
                            ? parseInt(context.selects.amount.choice)
                            : 0
                }))
            ]
        });
    }
}

BleaForh.id = 'blea-forh';

module.exports = BleaForh;
