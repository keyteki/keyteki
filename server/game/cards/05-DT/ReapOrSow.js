import Card from '../../Card.js';

class ReapOrSow extends Card {
    // Play: Choose one:
    // • Ready and reap with a friendly creature.
    // • Give three +1 power counters to creatures, distributed as you choose.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Ready and reap': () => true,
                        'Add power counters': ability.actions.sequentialForEach(() => ({
                            num: 3,
                            action: ability.actions.addPowerCounter({
                                promptForSelect: {
                                    activePromptTitle: 'Add a power counter',
                                    cardType: 'creature'
                                }
                            })
                        }))
                    }
                },
                'Ready and reap': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.reap()
                    ])
                }
            }
        });
    }
}

ReapOrSow.id = 'reap-or-sow';

export default ReapOrSow;
