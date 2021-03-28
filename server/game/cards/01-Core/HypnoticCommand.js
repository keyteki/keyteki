const Card = require('../../Card.js');

class HypnoticCommand extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'force a enemy creature to capture 1 amber for each mars creature they control',
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.creaturesInPlay.filter((card) => card.hasHouse('mars')).length,
                action: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle:
                            'Choose a creature to capture 1 amber from its controller',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            }))
        });
    }
}

HypnoticCommand.id = 'hypnotic-command';

module.exports = HypnoticCommand;
