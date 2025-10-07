import Card from '../../Card.js';

class LootOrPillage extends Card {
    // Play: Choose one:
    // • Steal 1A.
    // • A friendly creature captures 3A.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Steal 1 amber': ability.actions.steal(),
                        'Capture 3 amber': () => true
                    }
                },
                'Capture 3 amber': {
                    dependsOn: 'action',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.capture({ amount: 3 })
                }
            }
        });
    }
}

LootOrPillage.id = 'loot-or-pillage';

export default LootOrPillage;
