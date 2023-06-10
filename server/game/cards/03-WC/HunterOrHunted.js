const Card = require('../../Card.js');

class HunterOrHunted extends Card {
    // Play: Ward a creature, or move a ward from a creature to another creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Ward a creature': () => true,
                        'Move a ward': (context) => context.game.creaturesInPlay.length > 1
                    }
                },
                creature: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    gameAction: [
                        ability.actions.ward((context) => ({
                            target:
                                context.selects.action.choice === 'Ward a creature'
                                    ? context.targets.creature
                                    : []
                        })),
                        ability.actions.removeWardToken((context) => ({
                            target:
                                context.selects.action.choice === 'Move a ward'
                                    ? context.targets.creature
                                    : []
                        }))
                    ]
                },
                moveToCreature: {
                    dependsOn: 'creature',
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.targets.creature,
                    gameAction: ability.actions.addWardToken((context) => ({
                        amount:
                            context.targets.creature && context.targets.creature.tokens.ward
                                ? 1
                                : 0,
                        target:
                            context.selects.action.choice === 'Move a ward'
                                ? context.targets.moveToCreature
                                : []
                    }))
                }
            }
        });
    }
}

HunterOrHunted.id = 'hunter-or-hunted';

module.exports = HunterOrHunted;
