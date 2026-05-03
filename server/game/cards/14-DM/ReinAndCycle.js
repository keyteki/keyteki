const Card = require('../../Card.js');

class ReinAndCycle extends Card {
    // Play: Pay your opponent 1A. If you do, take control of an enemy creature or artifact.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.transferAmber((context) => ({
                target: context.player,
                amount: 1
            })),
            then: {
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player),
                    promptForSelect: {
                        cardType: ['creature', 'artifact'],
                        controller: 'opponent',
                        activePromptTitle: 'Choose an enemy creature or artifact',
                        message: '{0} uses {1} to take control of {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                }))
            }
        });
    }
}

ReinAndCycle.id = 'rein-and-cycle';

module.exports = ReinAndCycle;
