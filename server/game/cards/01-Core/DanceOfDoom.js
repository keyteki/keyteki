const Card = require('../../Card.js');

class DanceOfDoom extends Card {
    // Play: Choose a number. Destroy each creature with power equal to that number.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a number',
                mode: 'options',
                options: (context) =>
                    [
                        ...Array(
                            Math.max(0, ...context.game.creaturesInPlay.map((card) => card.power)) +
                                1
                        ).keys()
                    ].map((option) => ({ name: option, value: option }))
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.option
                    ? context.game.creaturesInPlay.filter(
                          (card) => card.power === context.option.value
                      )
                    : []
            })),
            effect: 'destroy all creatures with power {1}',
            effectArgs: (context) => context.option && context.option.value
        });
    }
}

DanceOfDoom.id = 'dance-of-doom';

module.exports = DanceOfDoom;
