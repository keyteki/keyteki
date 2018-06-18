const DrawCard = require('../../drawcard.js');

class YogoHiroue extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character into the conflict',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                gameAction: ability.actions.moveToConflict()
            },
            then: context => ({
                gameAction: ability.actions.delayedEffect({
                    target: context.target,
                    when: {
                        afterConflict: event => event.conflict.winner === context.player && context.target.allowGameAction('dishonor')
                    },
                    handler: () => this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Dishonor ' + context.target.name + '?',
                        context: context,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                this.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', context.player, context.target, context.source);
                                this.game.applyGameAction(context, { dishonor: context.target });
                            },
                            () => true
                        ]
                    })
                })
            })
        });
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
