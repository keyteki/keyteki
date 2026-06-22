const Card = require('../../Card.js');

class BarrelRoll extends Card {
    // Play: Move a creature to a flank of its controller's battleline and exhaust it.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.moveToFlank()
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => !!preThenContext.target,
                preferActionPromptMessage: true,
                gameAction: ability.actions.exhaust({ target: preThenContext.target }),
                message: '{0} uses {1} to move {3} to the {4} flank and exhaust it',
                messageArgs: () => {
                    const idx = preThenContext.target.controller.cardsInPlay.indexOf(
                        preThenContext.target
                    );
                    return [preThenContext.target, idx === 0 ? 'left' : 'right'];
                }
            })
        });
    }
}

BarrelRoll.id = 'barrel-roll';

module.exports = BarrelRoll;
