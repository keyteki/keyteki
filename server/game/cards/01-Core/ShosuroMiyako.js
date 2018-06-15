const DrawCard = require('../../drawcard.js');

class ShosuroMiyako extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Opponent discards or dishonors',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.type === 'character' &&
                                                  event.originalLocation === 'hand' && context.player.opponent
            },
            target: {
                mode: 'select',
                player: 'opponent',
                choices: {
                    'Discard at random': ability.actions.discardAtRandom(),
                    'Dishonor a character': ability.actions.dishonor(context => ({
                        promptForSelect: {
                            activePromptTitle: 'Choose a character to dishonor',
                            player: context.player.opponent,
                            controller: 'opponent',
                            message: '{0} chooses to dishonor {2}'
                        }
                    }))
                }
            },
            effect: 'force {1} to {2}',
            effectArgs: context => [context.player.opponent, context.select.toLowerCase()]
        });
    }
}

ShosuroMiyako.id = 'shosuro-miyako';

module.exports = ShosuroMiyako;
