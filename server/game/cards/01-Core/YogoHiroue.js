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
                let thenEvent = this.game.getEvent('unnamedEvent', {}, () => this.delayedEffect({
                    match: context.target,
                    trigger: 'afterConflict',
                    context: context,
                    condition: () => this.game.currentConflict.winner === context.player && context.target.allowGameAction('dishonor', context),
                    effectFunc: (card, context) => {
                        let event = this.game.getEventsForGameAction('dishonor', card, context)[0];
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Dishonor ' + context.target.name + '?',
                            choices: ['Yes', 'No'],
                            handlers: [
                                () => this.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', context.player, context.target, context.source),
                                () => event.cancel()
                            ],
                            source: context.source
                        });
                        return event;
                    }
                }));
                event.addThenEvent(thenEvent);
            }
        });
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
