const Card = require('../../Card.js');

class ChonkEvermore extends Card {
    // Play: You may give two creatures a +1 power counter. Double the number of +1 power counters on each creature.
    // Fate: Give each enemy creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle:
                        'Give two creatures a +1 power counter before doubling power counters?',
                    choices: {
                        'Power counters': () => true,
                        Continue: () => true
                    }
                },
                'Power counters': {
                    cardType: 'creature',
                    dependsOn: 'select',
                    gameAction: ability.actions.addPowerCounter(),
                    mode: 'exactly',
                    numCards: 2
                }
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !!card.tokens.power),
                    multiplier: 2
                })),
                message: '{0} uses {1} to double the number of +1 power counters on {3}',
                messageArgs: (context) => [
                    context.game.creaturesInPlay.filter((card) => !!card.tokens.power)
                ]
            }
        });

        this.fate({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.game.activePlayer.opponent.creaturesInPlay,
                amount: 2
            }))
        });
    }
}

ChonkEvermore.id = 'chonk-evermore';

module.exports = ChonkEvermore;
