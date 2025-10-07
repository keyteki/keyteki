import Card from '../../Card.js';

class DegenerateDecor extends Card {
    // Play: Choose one:
    // Exalt the most powerful creature 3 times.
    // The most powerful friendly creature captures 3.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Exalt 3 times': () => true,
                        'Capture 3': () => true
                    }
                },
                'Exalt 3 times': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    mode: 'mostStat',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.exalt({ amount: 3 })
                },
                'Capture 3': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    controller: 'self',
                    mode: 'mostStat',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    gameAction: ability.actions.capture({ amount: 3 })
                }
            }
        });
    }
}

DegenerateDecor.id = 'degenerate-decor';

export default DegenerateDecor;
