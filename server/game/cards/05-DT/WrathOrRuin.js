const Card = require('../../Card.js');

class WrathOrRuin extends Card {
    //Play: Choose one:
    //&amp;middot; Destroy a flank creature.
    //&amp;middot; Return 2 enemy creatures to their owners' hands.
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
                destroy: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.selects.action.choice === 'Destroy a flank creature',
                    activePromptTitle: 'Choose a creature to destroy',
                    cardType: 'creature',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: ability.actions.destroy()
                },
                return: {
                    targetCondition: (context) =>
                        context.selects.action.choice === 'Return 2 enemy creatures to hand',
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

module.exports = WrathOrRuin;
