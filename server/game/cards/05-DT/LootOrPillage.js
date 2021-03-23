const Card = require('../../Card.js');

class LootOrPillage extends Card {
    //- Play: Choose one:
    //- Steal 1A.
    //- A friendly creature captures 3A.
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
                Capture: {
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

module.exports = LootOrPillage;
