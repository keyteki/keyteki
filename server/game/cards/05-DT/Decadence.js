import Card from '../../Card.js';

class Decadence extends Card {
    // Play: Choose one:
    // • Exalt, ready, and use a friendly creature.
    // • Move 1A from a creature to another creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Exalt, ready and use': () => true,
                        'Move 1 amber': () => true
                    }
                },
                'Exalt, ready and use': {
                    dependsOn: 'action',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.sequential([
                        ability.actions.exalt(),
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                },
                'Move 1 amber': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    gameAction: ability.actions.removeAmber()
                }
            },
            then: (preThenContext) => ({
                condition: () => preThenContext.selects.action.choice === 'Move 1 amber',
                target: {
                    activePromptTitle: 'Choose another creature',
                    cardType: 'creature',
                    cardCondition: (card) => card !== preThenContext.targets['Move 1 amber'],
                    gameAction: ability.actions.placeAmber()
                },
                message: '{0} uses {1} to place 1 amber on {2}'
            })
        });
    }
}

Decadence.id = 'decadence';

export default Decadence;
