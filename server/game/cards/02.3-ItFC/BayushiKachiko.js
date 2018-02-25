const DrawCard = require('../../drawcard.js');

class BayushiKachiko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: () => this.isParticipating() && this.game.currentConflict.conflictType === 'political',
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.isParticipating() && card.getPoliticalSkill() < this.getPoliticalSkill()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                let sendHomeEvent = this.game.applyGameAction(context, { sendHome: context.target })[0];
                let menuEvent = this.game.addEventToWindow(sendHomeEvent.window, 'menuEvent', { order: sendHomeEvent.order + 1 }, event => {
                    if(!context.target.allowGameAction('bow', context) || sendHomeEvent.cancelled) {
                        event.cancelThenEvents();
                        return;
                    }
                    this.game.promptWithHandlerMenu(context.player, {
                        source: context.source,
                        activePromptTitle: 'Do you want to bow ' + context.target.name + '?',
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => context.game.addMessage('{0} chooses to bow {1} using {2}', context.player, context.target, context.source),
                            () => event.cancelThenEvents()
                        ]
                    });
                });
                menuEvent.addThenGameAction(context, { bow: context.target });
            }
        });
    }
}

BayushiKachiko.id = 'bayushi-kachiko';

module.exports = BayushiKachiko;
