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
                preferActionPromptMessage: true,
                gameAction: ability.actions.exhaust({ target: preThenContext.target }),
                message: '{0} uses {1} to move {3} to the {4} flank and exhaust it',
                messageArgs: () => {
                    const t = preThenContext.target;
                    const idx = t.controller.cardsInPlay.indexOf(t);
                    return [t, idx === 0 ? 'left' : 'right'];
                }
            })
        });
    }
}

BarrelRoll.id = 'barrel-roll';

module.exports = BarrelRoll;
