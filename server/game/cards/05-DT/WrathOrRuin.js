import Card from '../../Card.js';

class WrathOrRuin extends Card {
    // Play: Choose one:
    // • Destroy a flank creature.
    // • Return 2 enemy creatures to their owners’ hands.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Destroy a flank creature': () => true,
                        'Return 2 enemy creatures to hand': () => true
                    }
                },
                'Destroy a flank creature': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose a creature to destroy',
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: ability.actions.destroy()
                },
                'Return 2 enemy creatures to hand': {
                    dependsOn: 'action',
                    activePromptTitle: 'Choose which creatures to return',
                    mode: 'exactly',
                    numCards: 2,
                    controller: 'opponent',
                    cardType: 'creature',
                    gameAction: ability.actions.returnToHand()
                }
            }
        });
    }
}

WrathOrRuin.id = 'wrath-or-ruin';

export default WrathOrRuin;
