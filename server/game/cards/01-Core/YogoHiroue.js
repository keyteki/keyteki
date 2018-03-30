const DrawCard = require('../../drawcard.js');

class YogoHiroue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                let event = this.game.applyGameAction(context, { moveToConflict: context.target })[0];
                event.addThenEvent(this.game.getEvent('unnamedEvent', {}, () => context.source.delayedEffect({
                    target: context.target,
                    when: {
                        afterConflict: event => event.conflict.winner === context.player && context.target.allowGameAction('dishonor')
                    },
                    context: context,
                    handler: () => this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Dishonor ' + context.target.name + '?',
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                this.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', context.player, context.target, context.source);
                                this.game.applyGameAction(context, { dishonor: context.target });
                            },
                            () => true
                        ],
                        source: context.source
                    })
                })));
            }
        });
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
